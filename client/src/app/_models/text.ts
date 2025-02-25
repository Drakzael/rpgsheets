export function format(text: string) {
  console.log(`format ${text} : ${text?.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll(/--(.+?)--/g, "<strike>$1</strike>")
    .replaceAll(/\/\/(.+?)\/\//g, "<i>$1</i>")
    .replaceAll(/__(.+?)__/g, "<u>$1</u>")
    .replaceAll(/\*\*(.+?)\*\*/g, "<b>$1</b>")}`);
  return text?.replaceAll("<", "&lt;").replaceAll(">", "&gt;")
    .replaceAll(/--(.+?)--/g, "<strike>$1</strike>")
    .replaceAll(/\/\/(.+?)\/\//g, "<i>$1</i>")
    .replaceAll(/__(.+?)__/g, "<u>$1</u>")
    .replaceAll(/\*\*(.+?)\*\*/g, "<b>$1</b>");
};
