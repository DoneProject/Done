if(navigator.platform.search(/mac/i)==-1)
{
    document.head.insertAdjacentHTML("beforeEnd","<style>::-webkit-scrollbar{background-color: #eee;border-left: 1px #ddd solid;width: 10px;}::-webkit-scrollbar-thumb{background-color: #fff;-webkit-box-shadow:inset 0 0 0 1px #ddd;box-shadow: inset 0 0 0 1px #ddd;width: 15px;}</style>");
}