import React, { Component } from 'react'
import Editor from '../../src/index'
// import Editor from '../../dist'
import styles from './app.module.scss'
import value from '../static/help.md'

class App extends Component {
  constructor() {
    super()
    this.state = {
      value: '',
      mobile: false
    }
  }

  componentDidMount() {
    console.log('mounted')
    this.resize()
    window.addEventListener('resize', () => {
      this.resize()
    })
    setTimeout(() => {
      this.setState({
        value
      })
    }, 200)
  }

  resize() {
    if (window.matchMedia('(min-width: 768px)').matches) {
      this.setState({
        mobile: false
      })
    } else {
      this.setState({
        mobile: true
      })
    }
  }

  handleChange(value) {
    this.setState({
      value
    })
  }

  handleSave(value) {
    console.log('触发保存事件', value)
  }
  onAddImg=(file)=>{
    console.log(file)
    console.log('cccccccc')
    console.log(this.edit)
    this.edit.addToolbar_left_addImage('http://cdn.mmys.fun/7.jpg',file.name)
  }

  render() {
    const { value, mobile } = this.state

    return (
      <div className={styles.main}>
        <div className={styles.top}>
          <h1>for-editor</h1>
          <ul>
            <li>
              <a
                href="https://github.com/kkfor/for-editor"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub
              </a>
            </li>
          </ul>
        </div>
        <div className={styles.editor}>
            <Editor
              ref={(edit)=>this.edit=edit}
              language="en"
              height={200}
              value={value}
              onChange={value => this.handleChange(value)}
              onSave={value => this.handleSave(value)}
              onAddImg={this.onAddImg}
            />
          <Editor
            ref={(edit)=>this.edit=edit}
            language="en"
            height={200}
            value={value}
            onChange={value => this.handleChange(value)}
            onSave={value => this.handleSave(value)}
            onAddImg={this.onAddImg}
          />
        </div>
      </div>
    )
  }
}

export default App
