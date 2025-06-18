export const substituteTags = (text, toRegular) => {
  if(!text){
    return "";
  }
  
  if (toRegular) {
    text = text.replaceAll("<TUCNE>", "<b>");
    text = text.replaceAll("</TUCNE>", "</b>");
    text = text.replaceAll("<CERVENE>", '<span style="color: red">');
    text = text.replaceAll("</CERVENE>", "</span>");
  } else {
    text = text.replaceAll("<b>", "<TUCNE>");
    text = text.replaceAll("</b>", "</TUCNE>");
    text = text.replaceAll('<span style="color: red">', "<CERVENE>");
    text = text.replaceAll("</span>", "</CERVENE>");
  }
  return text;
};
