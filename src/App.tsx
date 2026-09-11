import { useEffect, useState } from 'react'
import './App.css'
import { categories, getLesson, hasLiveDemo, lessons } from './lessons.ts'
import { LiveDemo } from './live-demo.tsx'

function lessonIdFromHash() {
  return window.location.hash.slice(1) || undefined
}

function App() {
  const [selectedId, setSelectedId] = useState(
    () => getLesson(lessonIdFromHash()).id,
  )
  const lesson = getLesson(selectedId)
  const isExercise = lesson.kind === 'Exercise'

  useEffect(() => {
    function handleHashChange() {
      setSelectedId(getLesson(lessonIdFromHash()).id)
      window.scrollTo({ top: 0 })
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  function selectLesson(id: string) {
    if (id === selectedId) return
    window.location.hash = id
  }

  return (
    <div className="docs-layout">
      <aside className="sidebar">
        <a className="brand" href="#createConfig" aria-label="wagmi 学习首页">
          <span className="brand-mark">W</span>
          <span>
            <strong>wagmi lab</strong>
            <small>React v3.7.7</small>
          </span>
        </a>

        <nav className="sidebar-nav" aria-label="wagmi API 课程">
          {categories.map((category) => (
            <section className="nav-group" key={category}>
              <h2>{category}</h2>
              {lessons
                .filter((item) => item.category === category)
                .map((item) => (
                  <a
                    className={item.id === lesson.id ? 'active' : undefined}
                    href={`#${item.id}`}
                    key={item.id}
                    aria-current={item.id === lesson.id ? 'page' : undefined}
                  >
                    {item.title}
                  </a>
                ))}
            </section>
          ))}
        </nav>
      </aside>

      <main className="docs-main">
        <header className="mobile-header">
          <a className="brand" href="#createConfig">
            <span className="brand-mark">W</span>
            <strong>wagmi lab</strong>
          </a>
          <label>
            <span className="sr-only">选择课程</span>
            <select value={lesson.id} onChange={(event) => selectLesson(event.target.value)}>
              {categories.map((category) => (
                <optgroup label={category} key={category}>
                  {lessons
                    .filter((item) => item.category === category)
                    .map((item) => <option value={item.id} key={item.id}>{item.title}</option>)}
                </optgroup>
              ))}
            </select>
          </label>
        </header>

        <article className="lesson">
          <div className="lesson-heading">
            <div>
              <p className="breadcrumb">{lesson.category} / React API</p>
              <h1>{lesson.title}</h1>
            </div>
            <span className={`kind kind--${lesson.kind.toLowerCase()}`}>{lesson.kind}</span>
          </div>

          <p className="summary">{lesson.summary}</p>

          <section className="content-section">
            <h2>{isExercise ? '练习入口' : '示例代码'}</h2>
            <pre className="code-block"><code>{lesson.code}</code></pre>
          </section>

          <section className="content-section">
            <h2>{isExercise ? '练习输入' : '常用参数'}</h2>
            {lesson.parameters.length > 0 ? (
              <div className="api-table-wrap">
                <table className="api-table">
                  <thead><tr><th>名称</th><th>类型</th><th>说明</th></tr></thead>
                  <tbody>
                    {lesson.parameters.map((field) => (
                      <tr key={field.name}>
                        <td><code>{field.name}</code>{field.required ? <sup>必填</sup> : null}</td>
                        <td><code>{field.type}</code></td>
                        <td>{field.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : <p className="empty-state">这个 API 不需要业务参数。</p>}
          </section>

          {lesson.returns.length > 0 ? (
            <section className="content-section">
              <h2>{isExercise ? '验收结果' : '常用返回值'}</h2>
              <div className="api-table-wrap">
                <table className="api-table">
                  <thead><tr><th>字段</th><th>类型</th><th>说明</th></tr></thead>
                  <tbody>
                    {lesson.returns.map((field) => (
                      <tr key={field.name}>
                        <td><code>{field.name}</code></td>
                        <td><code>{field.type}</code></td>
                        <td>{field.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ) : null}

          <section className="content-section">
            <h2>{isExercise ? '实现约束' : '关键说明'}</h2>
            <ul className="notes">
              {lesson.notes.map((note) => <li key={note}>{note}</li>)}
            </ul>
          </section>

          {hasLiveDemo(lesson.id) ? (
            <section className="content-section">
              <h2>{isExercise ? '你的工作区' : '运行示例'}</h2>
              <LiveDemo lessonId={lesson.id} />
            </section>
          ) : null}
        </article>
      </main>
    </div>
  )
}

export default App
