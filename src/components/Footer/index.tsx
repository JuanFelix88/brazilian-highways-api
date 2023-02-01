export function Root () {
  return (
    <footer className="flex flex-col items-center mt-12 sm:flex-row sm:justify-between">
      <a
        href="/politica-de-privacidade"
        className="text-gray-700 transition-colors duration-300  hover:text-blue-500"
      >
        Política de Privacidade
      </a>
      <div className="mt-4 -mx-4 md:mt-0">
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
