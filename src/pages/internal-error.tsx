export const InternalErrorPage = () => {
  return (
    <>
      <h1>500 Internal Error</h1>

      <p>Sorry, an internal error occurred.</p>

      <p class="flex fit-content">
        <a href="/">Go back to the homepage</a>
        <span class="divider" />
        <a href=".">Refresh page</a>
      </p>
    </>
  );
};
