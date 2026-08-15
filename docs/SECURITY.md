# Security and ethical scope

MEV Sentinel is strictly an analytics platform.

The codebase deliberately excludes transaction signing, private-key storage, bundle relay submission, front-running, sandwich execution, and exploit automation.

Recommended deployment controls:
- store RPC credentials in environment variables
- do not commit `.env`
- place the API behind TLS/reverse proxy
- enable authentication before public deployment
- apply stronger distributed rate limiting for internet-facing APIs
- restrict MySQL to private networks
