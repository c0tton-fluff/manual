---
title: Brain Sharing
---

Guides, tools, and knowledge sharing. Everything here is either open source or described well enough to build your own. The goal is practical -- things that work, how to set them up, and why they exist.

## Tools & Projects

- **[Phantom](Phantom.md)** -- autonomous pentest operator. Go detectors, signal-based planning, chain analysis. The AI thinks, Go tests.

## MCP Servers

MCP (Model Context Protocol) servers give AI assistants structured access to external tools. These are all Go binaries that run via stdio transport -- single binary, zero runtime dependencies.

- **[Caido MCP Server](MCP%20Setup/Caido%20MCP%20Setup.md)** -- 42 tools for the Caido web proxy. Replay, intercept, fuzz, and manage findings from your AI assistant.
- **[Burp MCP Server](MCP%20Setup/Burp%20MCP%20Setup.md)** -- 10 tools for Burp Suite Professional. Send requests, race conditions, proxy history, scanner findings.
- **[SentinelOne MCP Server](MCP%20Setup/SentinelOne%20MCP%20Server.md)** -- 14 tools for SentinelOne EDR. Threat management, agent control, Deep Visibility hunting.
- **[HackerOne MCP Server](MCP%20Setup/HackerOne%20MCP.md)** -- 14 tools for HackerOne triage. Report lifecycle, severity, assignments, program management.
- **[Caido Go SDK](MCP%20Setup/Caido%20SDK%20Go.md)** -- community Go SDK for building custom Caido integrations.

## Security Tools

- **[Bagel](MCP%20Setup/Bagel.md)** -- dev workstation security scanner. Checks Git, SSH, npm, cloud creds, AI tools for misconfigs and leaked secrets.
- **[Secret Scrubber](MCP%20Setup/Secret%20Scrubber.md)** -- finds and removes secrets from AI CLI session logs. 21 patterns, zero dependencies.

## Guides

- **[The AI-Era Security Engineer](AI-Era%20Security%20Engineering.md)** -- practical guide for security professionals building, specifying, and reviewing code in the age of AI-assisted development.
