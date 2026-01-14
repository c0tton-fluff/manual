import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { classNames } from "../quartz/util/lang"

const ProfileCard: QuartzComponent = () => {
  return (
    <div class={classNames("card", "profile-card")}>
      <div class="card-title">Be Useful!</div>
      <div class="card-body">
      </div>
    </div>
  )
}

export default (() => ProfileCard) satisfies QuartzComponentConstructor

