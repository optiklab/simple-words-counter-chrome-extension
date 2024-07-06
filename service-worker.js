const title = chrome.runtime.getManifest().name;

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

function setupContextMenu() {
  chrome.contextMenus.create({
      id: 'page-stat',
      title: title,
      contexts: ['selection']
  });
}

async function pushToStorage(stat) {

  sessionStorage.setItem("my_page_stat", stat);

  alert(stat);
}

chrome.contextMenus.onClicked.addListener((data, tab) => {

  const text = data.selectionText;

  const words = text.split(/\s+/);

  let wordsMap = new Map();

  words.forEach((value, index) => {
      const clearValue = value.replace(/[^a-zA-Z]/g, "").trim();
  
      if (clearValue !== null && clearValue.length !== 0)
      {
          if (wordsMap.has(clearValue))
          {
              let counter = wordsMap.get(clearValue);
              wordsMap.set(clearValue, counter + 1);
          }
          else
          {
              wordsMap.set(clearValue, 1);
          }
      }
  })
  
  var arr = [];
  for (let [key, value] of wordsMap) {
      arr.push({
        name: key,
        value: value
      });
  }

  var sortedWords = arr.sort(function(a, b) {
    return (a.value > b.value) ? -1 : ((a.value < b.value) ? 1 : 0)
  });

  const wordCount = words.length;
  const charCount = text.length;
  
  let totalLength = 0;
  let maxLength = 0;
  
  for (let i = 0; i < wordCount; i++) {
      const curLength = words[i].replace(/[^a-zA-Z ]/g, "").length;
      totalLength += curLength;
      if (curLength > maxLength) {
          maxLength = curLength;
      }
  }
  const avgLength = wordCount === 0
      ? 0
      : totalLength / wordCount;

  const numAverageDigits = 2;

  let stat = `Stat on selected text:
Word Count: ${wordCount}
Character Count: ${charCount}
Average Word Length: ${avgLength.toFixed(numAverageDigits)}
Longest Word Length: ${maxLength}
Twenty most frequent:
  `;
  
  let counter = 0;
  for (let item of sortedWords) {
      stat += item.name + ' (' + item.value + ' times)\r\n';
      if (counter > 20)
      {
          break;
      }
      counter++;
  }

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func : pushToStorage,
    args : [ stat ]
  });

});
