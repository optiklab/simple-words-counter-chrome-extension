async function sayHello() {
    let [tab] = await chrome.tabs.query({ active: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
            
            const my_page_stat = sessionStorage.getItem("my_page_stat");
            //console.log(my_page_stat);
            alert(my_page_stat);
        }
    })
}
document.getElementById("myButton").addEventListener("click", sayHello);