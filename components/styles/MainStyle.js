import { horizontalScale, moderateScale, verticalScale } from "./Metrics";

export const inputBox = {
  borderWidth: 1,
  borderColor: '#01315C',
  borderRadius: 8,
  marginTop: verticalScale(30),
  padding: 10,
};

export const searchBox = {
  borderWidth: 1,
  borderColor: '#01315C',
  borderRadius: 8,
  marginTop: verticalScale(10),
  paddingHorizontal: horizontalScale(8),
  flexDirection: 'row',
  alignItems: 'center',
  width: horizontalScale(170),
  padding: moderateScale(7),
};
export const boxContainer = {
  flex: 1,
  backgroundColor: '#EEF7FF',
  paddingBottom: verticalScale(10),
  borderRadius: 16,
  marginLeft: 20,
  justifyContent: 'center',
  alignItems: 'center',
};
export const text = {
  fontSize: 16,
  color: '#01315C',
  fontWeight: 600,
};

export const button = {
  backgroundColor: '#01315C',
  borderRadius: 8,
  padding: 14,
};

export const buttonText = {
  color: 'white',
  textAlign: 'center',
};

export const tableHeader = {
  borderBottomWidth: 1,
  borderBottomColor: '#01315C',
  paddingBottom: verticalScale(15)
};

export const dataText = {
  fontSize: 20,
  color: '#01315C',
  paddingVertical: 20,
  backgroundColor: 'red',
};

export const remarks = {
  borderColor: '#C4C4C4',
  borderWidth: 1,
  color: "#000",
  backgroundColor: 'white',
  fontSize: 20,
  marginTop: 20,
};
