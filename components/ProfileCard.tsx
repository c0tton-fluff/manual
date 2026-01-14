import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { classNames } from "../quartz/util/lang"

const ProfileCard: QuartzComponent = () => {
  return (
    <div class={classNames("card", "profile-card")}>
      <div class="card-title">John Matrix</div>
      <div class="card-body">
        <div>Notes, research, writeups</div>
      </div>
    </div>
  )
}

export default (() => ProfileCard) satisfies QuartzComponentConstructor

