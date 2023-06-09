export default async function myFetch(url, options) {
  const response = await fetch(url, {
    method: options.method,
    headers: {},
  })
  const data = await response.json()
  if (response.status === 401) {
    window.location.href = "/login"
    return {}
  }
  if (response.status === 400) {
    window.location.href = "/login"
    return {}
  }
  return data
}
