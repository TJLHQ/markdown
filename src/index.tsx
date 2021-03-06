import * as React from 'react'
import classNames from 'classnames'
import marked from './lib/helpers/marked'
import keydownListen from './lib/helpers/keydownListen'
import './lib/fonts/iconfont.css'
import './lib/css/index.scss'
import ToolbarLeft from './components/toolbar_left'
import ToolbarRight from './components/toolbar_right'
import { toolbar_right_click } from './lib/toolbar_click/toolbar_right_click'
import { toolbar_left_click ,toolbar_left_addImage} from './lib/toolbar_click/toolbar_left_click'
import { CONFIG } from './lib'

interface P {
  value: string
  lineNum: number
  onChange: (value: string) => void
  onSave: (value: string) => void
  onAddImg:(file:File)=>void
  placeholder: string
  fontSize: string
  disabled: boolean
  style: object
  height: number
  preview: boolean
  expand: boolean
  subfield: boolean
  toolbar: object
  language: string,
}

interface S {
  preview_switch: boolean
  expand_switch: boolean
  subfield_switch: boolean
  f_history: string[]
  f_history_index: number
  line_index: number
  value: string
  words: object,
  height: number,
  isDrap:boolean,
  startY:number,
  constanceHeight:number
}


class MdEditor extends React.Component<P, S> {
  private drag: HTMLDivElement
  constructor(props: P) {
    super(props)

    this.state = {
      preview_switch: props.preview,
      expand_switch: props.expand,
      subfield_switch: props.subfield,
      f_history: [],
      f_history_index: 0,
      line_index: 1,
      value: props.value,
      words: {},
      height:props.height,
      isDrap:false,
      startY:0,
      constanceHeight:props.height
    }
  }
  private $vm: HTMLTextAreaElement
  private $scrollEdit: HTMLDivElement
  private $scrollPreview: HTMLDivElement
  private $blockEdit: HTMLDivElement
  private $blockPreview: HTMLDivElement
  private currentTimeout: null | number | NodeJS.Timer

  static defaultProps = {
    lineNum: true,
    onChange: () => { },
    onSave: () => { },
    fontSize: '14px',
    disabled: false,
    preview_switch: false,
    expand_switch: false,
    subfield_switch: false,
    style: {},
    toolbar: CONFIG.toolbar,
    language: 'zh-CN'
  }

  componentDidMount() {
    const { value } = this.props
    keydownListen(this)
    this.reLineNum(value)
    this.initLanguage()
    // const drayId=document.querySelector('.drag-icon');
    this.drag.addEventListener('mousedown',(e:any)=>{
      this.setState({
        isDrap:true,
        startY:e.clientY
      })
      document.addEventListener('mousemove',this.mouseMove)
    })
    document.addEventListener('mouseup',()=>{
      this.setState({isDrap:false,constanceHeight:this.state.height})
      document.removeEventListener('mousemove',this.mouseMove)
    })

  }
  mouseMove=(e)=>{
    if(!this.state.isDrap)return
    const moveY=e.clientY-this.state.startY;
    const height=this.state.constanceHeight+moveY
    if(height>this.props.height){
      this.setState({height})
    }
    e.preventDefault()
  }

  componentDidUpdate(preProps) {
    const { value } = this.props
    const { f_history, f_history_index } = this.state
    if (preProps.value !== value) {
      this.reLineNum(value)
    }
    if (value !== f_history[f_history_index]) {
      window.clearTimeout(Number(this.currentTimeout))
      this.currentTimeout = setTimeout(() => {
        this.saveHistory(value)
      }, 500);
    }
  }

  initLanguage() {
    const { language } = this.props
    let lang = CONFIG.langList.indexOf(language) >= 0 ? language : 'zh-CN'
    this.setState({
      words: CONFIG[lang]
    })
  }

  // ???????????????
  handleChange(e) {
    const value = e.target.value
    this.props.onChange(value)
  }

  // ????????????
  saveHistory(value) {
    let { f_history, f_history_index } = this.state
    // ??????????????????????????????????????????
    f_history.splice(f_history_index + 1, f_history.length)
    if (f_history.length >= 20) {
      f_history.shift()
    }
    // ??????????????????
    f_history_index = f_history.length
    f_history.push(value)
    this.setState({
      f_history,
      f_history_index
    })
  }

  // ??????????????????
  reLineNum(value) {
    const line_index = value ? value.split('\n').length : 1
    this.setState({
      line_index
    })
  }

  // ??????
  save() {
    this.props.onSave(this.$vm.value)
  }

  // ????????????
  toolBarLeftClick(type) {
    toolbar_left_click(type, this)
  }

  toolBarRightClick(type) {
    toolbar_right_click(type, this)
  }

  focusText() {
    this.$vm.focus()
  }
// ????????????
  addImg = (file: File) => {
    // const onAddImg=this.props.onAddImg;
    // onAddImg&&onAddImg(file)
    this.props.onAddImg(file)
  }
  addToolbar_left_addImage=(url:string,name:string)=>{
    toolbar_left_addImage(url,name,this)
  }
  handleScoll(e) {
    const radio = this.$blockEdit.scrollTop / (this.$scrollEdit.scrollHeight - e.target.offsetHeight)
    this.$blockPreview.scrollTop = (this.$scrollPreview.scrollHeight - this.$blockPreview.offsetHeight) * radio
  }

  render() {
    const { preview_switch, expand_switch, subfield_switch, line_index, words,height } = this.state
    const { value, placeholder, fontSize, disabled, style, toolbar } = this.props
    const editorClass = classNames({
      'for-editor-edit': true,
      'for-panel': true,
      'for-active': preview_switch && subfield_switch,
      'for-edit-preview': preview_switch && !subfield_switch
    })
    const previewClass = classNames({
      'for-panel': true,
      'for-editor-preview': true,
      'for-active': preview_switch && subfield_switch,
    })
    const fullscreen = classNames({
      'for-container': true,
      'for-fullscreen': expand_switch
    })
    const lineNumStyles = classNames({
      'for-line-num': true,
      hidden: !this.props.lineNum
    })

    // ??????
    function lineNum() {
      const list = []
      for (let i = 0; i < line_index; i++) {
        list.push(<li key={i + 1}>{i + 1}</li>)
      }
      return <ul className={lineNumStyles}>{list}</ul>
    }

    return (
      <div className={fullscreen} style={{ height:`${height}px`, ...style }}>
        {/* ????????? */}
        {
          Boolean(Object.keys(toolbar).length) &&
          <div className="for-controlbar">
            <ToolbarLeft
              toolbar={toolbar}
              words={words}
              onClick={type => this.toolBarLeftClick(type)}
              addImg={this.addImg}
            />
            <ToolbarRight
              toolbar={toolbar}
              words={words}
              preview={preview_switch}
              expand={expand_switch}
              subfield={subfield_switch}
              onClick={type => this.toolBarRightClick(type)} />
          </div>
        }
        {/* ????????? */}
        <div className="for-editor" style={{ fontSize }}>
          {/* ????????? */}
          <div className={editorClass} ref={$v => this.$blockEdit = $v} onScroll={e => this.handleScoll(e)} onClick={() => this.focusText()}>
            <div className="for-editor-block" ref={$v => this.$scrollEdit = $v}>
              {lineNum()}
              <div className="for-editor-content">
                <pre>{value} </pre>
                <textarea
                  ref={$vm => this.$vm = $vm}
                  value={value}
                  disabled={disabled}
                  onChange={e => this.handleChange(e)}
                  placeholder={placeholder ? placeholder : words['placeholder']}
                />
              </div>
            </div>
          </div>
          {/* ????????? */}
          <div className={previewClass} ref={$v => this.$blockPreview = $v}>
            <div
              ref={$v => this.$scrollPreview = $v}
              className="for-preview for-markdown-preview"
              dangerouslySetInnerHTML={{ __html: marked(value) }}
            />
          </div>
        </div>
        <div
          className='drag-icon'
          ref={(edit)=>this.drag=edit}
        >
          <ul>
            <li />
            <li />
          </ul>
        </div>
      </div>
    )
  }
}

export default MdEditor
