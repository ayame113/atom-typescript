import * as etch from "etch"
import {renderTooltip} from "./tooltipRenderer"
import {adjustElementPosition} from "./util"

interface Props extends JSX.Props {
  left: number
  right: number
  top: number
  bottom: number
  info?: protocol.QuickInfoResponseBody
}

export class TooltipView implements JSX.ElementClass {
  public readonly element!: HTMLDivElement
  public props: Props

  constructor() {
    this.props = {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    }
    etch.initialize(this)
  }

  public async destroy() {
    return etch.destroy(this)
  }

  public async update(props: Partial<Props>) {
    this.props = {...this.props, ...props}
    await etch.update(this)
  }

  public writeAfterUpdate() {
    adjustElementPosition(
      this.element,
      document.body,
      this.props,
      atom.config.get("atom-typescript").tooltipPosition,
    )
  }

  public render() {
    const code = this.props.info ? (
      <div className="atom-typescript-tooltip-tooltip-code">
        {this.props.info.displayString.replace(/^\(.+?\)\s+/, "")}
      </div>
    ) : null
    const [kind, docs] = this.props.info ? renderTooltip(this.props.info, etch) : [null, null]
    return (
      <div className="atom-typescript-tooltip tooltip">
        <div className="tooltip-inner">
          {code}
          {kind}
          {docs}
        </div>
      </div>
    )
  }
}
