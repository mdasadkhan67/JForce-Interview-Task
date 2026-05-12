import SEO from "../components/SEO"

const NotFound = () => {
  return (
    <>
      <SEO
        title="404 Not Found"
        description="The page you are looking for does not exist."
        keywords="404, not found, page not found"
      />
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-5xl font-bold">404 Page Not Found</h1>
      </div>
    </>
  )
}

export default NotFound