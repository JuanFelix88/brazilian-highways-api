export function Root() {
  return (
    <footer className="mt-12 flex flex-col items-center sm:flex-row sm:justify-between">
      <a
        href="/politica-de-privacidade"
        className="text-gray-700 transition-colors duration-300  hover:text-blue-500"
      >
        Política de Privacidade
      </a>
      <div className="-mx-4 mt-4 md:mt-0">
        <a
          href="#"
          className="px-4 text-gray-700 transition-colors duration-300 hover:text-blue-500"
        >
          {' '}
          Facebook
        </a>
        <a
          href="#"
          className="px-4 text-gray-700 transition-colors duration-300  hover:text-blue-500"
        >
          Instagram
        </a>
        <a
          href="#"
          className="px-4 text-gray-700 transition-colors duration-300  hover:text-blue-500 dark:hover:text-blue-400"
        >
          {' '}
          LinkedIn
        </a>
      </div>
    </footer>
  )
}
