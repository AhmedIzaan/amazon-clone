# Demo account model

Aster uses a local demo account so the buying journey can be evaluated without a backend or third-party identity service.

## What is stored

- The signed-in flag, profile, and one saved address are stored in `localStorage` under `aster-demo-account-v1`.
- Demo orders remain in `localStorage` under `aster-orders-v1`.
- A signed-in saved address becomes the default address for a new checkout draft.

## Deliberate limitations

- There is no server session, identity verification, access control, encryption at rest, recovery flow, or multi-device sync.
- Passwords are never stored or transmitted. The seeded account accepts the credentials shown on the sign-in screen.
- Because locally created accounts have no stored password verifier, a matching email plus any eight-character demo password can reopen that local profile.
- Anyone with access to the same browser profile can inspect or change this demo data.

Use invented profile information and never enter a real password. A production version should replace this provider with server-backed authentication, secure cookies, verified account ownership, rate limiting, recovery, and protected account/order APIs.
