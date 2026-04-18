import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

const NotFound: QuartzComponent = ({ cfg }: QuartzComponentProps) => {
  const url = new URL(`https://${cfg.baseUrl ?? "example.com"}`)
  const baseDir = url.pathname

  return (
    <article class="popover-hint">
      <div class="terminal-404">
        <div class="terminal-404-window">
          <div class="terminal-404-bar">
            <span class="terminal-404-dot" style="background: #e74c3c"></span>
            <span class="terminal-404-dot" style="background: #f4d03f"></span>
            <span class="terminal-404-dot" style="background: #2ecc71"></span>
            <span>bash -- 80x24</span>
          </div>
          <div class="terminal-404-body">
            <div><span class="t404-prompt">$ </span><span class="t404-cmd">curl -I {cfg.baseUrl}{typeof window !== 'undefined' ? window.location.pathname : '/???'}</span></div>
            <div><span class="t404-err">HTTP/1.1 404 Not Found</span></div>
            <div><span class="t404-dim">Content-Type: text/html</span></div>
            <div><span class="t404-dim">X-Error: SEGFAULT_IN_REALITY</span></div>
            <br />
            <div><span class="t404-prompt">$ </span><span class="t404-cmd">echo $?</span></div>
            <div><span class="t404-err">127</span><span class="t404-dim"> -- command not found</span></div>
            <br />
            <div><span class="t404-dim"># The page you requested doesn't exist.</span></div>
            <div><span class="t404-dim"># Either it was moved, deleted, or you typed it wrong.</span></div>
            <br />
            <div>
              <a href={baseDir} class="t404-link">cd ~</a>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

export default (() => NotFound) satisfies QuartzComponentConstructor
