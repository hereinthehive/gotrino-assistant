export function exportedButUndocumented(input: string) {
  return input.toUpperCase();
}

export function createUser(name: string, email: string, region: string) {
  // region param added 2024 but docs not updated
  return { name, email, region };
}

const SECRET_KEY = process.env.SECRET_API_KEY;
const TIMEOUT = process.env.REQUEST_TIMEOUT_MS;
