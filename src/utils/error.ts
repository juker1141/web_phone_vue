const customErrorHandler = (err: any) => {
  let message = err
  if (err instanceof Error) {
    message = err.message
  }
  console.error('Caught Error: ', message)
}

export { customErrorHandler }
