# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of Yaami seriously. If you discover a security vulnerability, please follow these steps:

### How to Report

1. **DO NOT** open a public issue
2. Email security details to: kishankumarc9@gmail.com
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Response Time**: We aim to respond within 48 hours
- **Updates**: You'll receive regular updates on the progress
- **Disclosure**: We'll work with you on a coordinated disclosure timeline
- **Credit**: We'll credit you for the discovery (unless you prefer to remain anonymous)

### Security Best Practices for Users

When using Yaami:

- Keep your version up to date
- Never share your connection credentials
- Use SSH keys instead of passwords when possible
- Review connection details before saving
- Be cautious when connecting to untrusted servers
- Use strong, unique passwords for each connection
- Enable 2FA on your cloud storage services when available

### Security Features

Yaami implements several security measures:

- **Context Isolation**: Renderer process is isolated from main process
- **Secure IPC**: Communication between processes uses secure channels
- **Local Storage**: Credentials are stored locally, not in the cloud
- **No Telemetry**: We don't collect or transmit your data

### Known Security Considerations

- Credentials are stored in plain text in local config files
  - Ensure your system is protected with disk encryption
  - Future versions will implement credential encryption
- SMB connections may expose credentials in process memory
- Always verify server certificates when using encrypted protocols

## Security Updates

Security updates will be released as soon as possible after a vulnerability is confirmed. Updates will be announced in:

- GitHub Security Advisories
- Release notes
- README.md

Thank you for helping keep Yaami and its users safe!
