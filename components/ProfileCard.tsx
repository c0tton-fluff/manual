import { QuartzComponent, QuartzComponentConstructor } from "./types"
import { classNames } from "../quartz/util/lang"

const PROFILE_IMAGE = "/static/arnold.jpg"
const ProfileCard: QuartzComponent = () => {
  return (
    <div class={classNames("card", "profile-card")}>
      <img src={PROFILE_IMAGE} alt="John Matrix" class="profile-img" />
      <div class="card-body"></div>
    </div>
  )
}

export default (() => ProfileCard) satisfies QuartzComponentConstructor
