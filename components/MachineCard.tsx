
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../quartz/components/types"
import { classNames } from "../quartz/util/lang"

const MachineCard: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  return (
    <div class={classNames("card", "machine-card")}>
      <div class="card-body">
      </div>
    </div>
  )
}

export default (() => MachineCard) satisfies QuartzComponentConstructor

