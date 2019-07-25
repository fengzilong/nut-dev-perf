const fse = require( 'fs-extra' )
const path = require( 'path' )

const CREATE_PAGE_NUM = 2000

;( async () => {
  const cwd = process.cwd()

  const file = path.join( __dirname, 'page-template.vue' )
  const buffer = await fse.readFile( file, 'utf8' )
  const source = buffer.toString()

  const sidebar = []

  await fse.ensureDir( path.join( cwd, 'src/pages' ) )

  for ( let i = 0; i < CREATE_PAGE_NUM; i++ ) {
    const destFile = path.join( cwd, `src/pages/todomvc_${ i }.vue` )
    await fse.writeFile(
      destFile,
      source.replace( /<h1>todos<\/h1>/g, `<h1>todos ${ i }</h1>` ),
      'utf8'
    )
    sidebar.push( JSON.stringify( {
      title: `todomvc_${ i }`,
      path: `pages/todomvc_${ i }`
    }, 0, 2 ) )
    process.stdout.write( '.' )
  }

  const sidebarFile = path.join( cwd, 'src/sidebar.js' )
  const sidebarSource = `
    const sidebar = [
      {
        title: '菜单',
        children: [
          ${ sidebar.join( ',\n' ) }
        ]
      }
    ]

    export default sidebar
  `
  await fse.writeFile( sidebarFile, sidebarSource, 'utf8' )
} )()
