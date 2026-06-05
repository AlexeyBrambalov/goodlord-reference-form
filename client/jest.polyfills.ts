// jsdom doesn't provide TextEncoder/TextDecoder, which `effect` requires.
// Runs via `setupFiles`, before any test module (and effect) is imported.
import { TextEncoder, TextDecoder } from 'util'

Object.assign(globalThis, { TextEncoder, TextDecoder })
