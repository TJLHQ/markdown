import * as React from 'react'
interface P {
  onClick: (type: string) => void,
  addImg:(val:any)=>void,
  toolbar: object,
  words: object
}

interface S { }

class Toolbars extends React.Component<P, S> {
  constructor(props: P) {
    super(props)
  }

  static defaultProps = {
    onClick: () => { },
    toolbar: {},
    words: {}
  }

  // 快捷插入
  onClick(type) {
    this.props.onClick(type)
  }
  addImgFile(e: any) {
    const addImg=this.props.addImg;
    addImg&&addImg(e.target.files[0])
    e.target.value = ''
  }

  render() {
    const { toolbar, words } = this.props
    return (
      <ul>
        {
          toolbar['undo'] &&
          <li onClick={() => this.onClick('undo')} title={`${words['undo']} (ctrl+z)`}>
            <i className="foricon for-undo" />
          </li>
        }
        {
          toolbar['redo'] &&
          <li onClick={() => this.onClick('redo')} title={`${words['redo']} (ctrl+y)`}>
            <i className="foricon for-redo" />
          </li>
        }
        {
          toolbar['h1'] &&
          <li onClick={() => this.onClick('h1')} title={words['h1']}>
            H1
        </li>
        }
        {
          toolbar['h2'] &&
          <li onClick={() => this.onClick('h2')} title={words['h2']}>
            H2
        </li>
        }
        {
          toolbar['h3'] &&
          <li onClick={() => this.onClick('h3')} title={words['h3']}>
            H3
        </li>
        }
        {
          toolbar['h4'] &&
          <li onClick={() => this.onClick('h4')} title={words['h4']}>
            H4
        </li>
        }
        {
          toolbar['img'] &&
          <li title={words['img']}>
            <input type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" onChange={(e) => this.addImgFile(e)}/>
            <i className="foricon for-image" />
          </li>
        }
        {
          toolbar['link'] &&
          <li onClick={() => this.onClick('link')} title={words['link']}>
            <i className="foricon for-link" />
          </li>
        }
        {
          toolbar['code'] &&
          <li onClick={() => this.onClick('code')} title={words['code']}>
            <i className="foricon for-code" />
          </li>
        }
        {
          toolbar['save'] &&
          <li onClick={() => this.onClick('save')} title={`${words['save']} (ctrl+s)`}>
            <i className="foricon for-save" />
          </li>
        }
      </ul>
    )
  }
}

export default Toolbars
