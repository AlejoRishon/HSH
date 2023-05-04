import { Dimensions } from "react-native"

const { width, height } = Dimensions.get('window')


const guidelineBaseWidth = 375
const guidelineBaseHeight = 812

const horizontalScale = (size) => (width / guidelineBaseWidth) * size
const verticalScale = (size) => (height / guidelineBaseHeight) * size
const moderateScale = (size, factor = 0.5) => size + (horizontalScale(size) - size) * factor

export { horizontalScale, verticalScale, moderateScale }

//verticalScale: height, marginTop, marginBotton, marginVertical, line-height, paddingTop, paddingBotton, paddingVertical

//horizontalScale: width, marginLeft, marginRight, marginHorizontal, paddingLeft, paddingRight, paddingHorizontal

//moderateScale: font-size, borderRadius