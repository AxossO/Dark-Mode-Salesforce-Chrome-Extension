// chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
//   // console.log(message);
//   // console.log(sender);
//   // console.log(sendResponse);
//   if (message.darkModeEnabled) {
//     document.body.classList.add("darkmode");
//     console.log("DarkMode added hehe <3");
//     function changeColor() {
//       var iframes = document.querySelectorAll("#emailuiFrame");
//       iframes.forEach(function (iframe) {
//         var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
//         var content = iframeDoc.body;
//         // if (content.table.tbody.tr.td) {
//         //   content.style.cssText = "background-color: #1c1c1c !important";
//         // } else {
//         //   null;
//         // }
//         if (content.querySelector("table")) {
//           const table = content.querySelector("table");
//           // console.log(table);
//           table.style.color = "black";
//           table.style.cssText = "background-color: #1c1c1c !important";
//         } else {
//           content.style.color = "white";
//         }
//       });
//     }
//     const clicker = document.querySelectorAll(".cuf-feedItemHeader.cuf-media");
//     clicker.forEach((e) => {
//       e.addEventListener("click", () => {
//         // console.log(e);
//         changeColor();
//       });
//     });

//     const targetNode = document.body;
//     const config = {
//       childList: true,
//       subtree: true,
//     };
//     const callback = (mutationsList, observer) => {
//       for (const mutation of mutationsList) {
//         if (mutation.type === "childList") {
//           mutation.addedNodes.forEach((node) => {
//             if (node.nodeType === 1) {
//               const matches = node.querySelectorAll(
//                 ".cuf-feedItemHeader.cuf-media"
//               );
//               matches.forEach((match) => {
//                 // console.log("node: SECOND", match);
//                 match.addEventListener("click", () => {
//                   changeColor();
//                 });
//               });
//             }
//           });
//         }
//       }
//     };
//     const observer = new MutationObserver(callback);
//     observer.observe(targetNode, config);
//   } else if (!message.darkModeEnabled) {
//     let addedElements = document.querySelectorAll(".darkmode");
//     addedElements.forEach(function (element) {
//       if (element.classList.contains("darkmode")) {
//         element.classList.remove("darkmode");
//         console.log("removed DarkMode -_-");
//       }
//     });
//     //   }
//   }
// });

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  // console.log(message);
  // console.log(sender);
  // console.log(sendResponse);
  if (message.hasOwnProperty("darkModeEnabled")) {
    if (message.darkModeEnabled) {
      document.body.classList.add("darkmode");
      function changeColor() {
        var iframes = document.querySelectorAll("#emailuiFrame");
        iframes.forEach(function (iframe) {
          var iframeDoc =
            iframe.contentDocument || iframe.contentWindow.document;
          var content = iframeDoc.body;
          // if (content.table.tbody.tr.td) {
          //   content.style.cssText = "background-color: #1c1c1c !important";
          // } else {
          //   null;
          // }
          if (content.querySelector("table")) {
            const table = content.querySelector("table");
            table.style.color = "black";
            table.style.cssText = "background-color: #1c1c1c !important";
          } else {
            content.style.color = "white";
          }
        });
      }
      const clicker = document.querySelectorAll(
        ".cuf-feedItemHeader.cuf-media"
      );
      clicker.forEach((e) => {
        e.addEventListener("click", changeColor);
      });

      const targetNode = document.body;
      const config = {
        childList: true,
        subtree: true,
      };
      const callback = (mutationsList, observer) => {
        for (const mutation of mutationsList) {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === 1) {
                const matches = node.querySelectorAll(
                  ".cuf-feedItemHeader.cuf-media"
                );
                matches.forEach((match) => {
                  // console.log("node: SECOND", match);
                  match.addEventListener("click", changeColor);
                });
              }
            });
          }
        }
      };
      const observer = new MutationObserver(callback);
      observer.observe(targetNode, config);
    } else {
      let addedElements = document.querySelectorAll(".darkmode");
      addedElements.forEach(function (element) {
        element.classList.remove("darkmode");
        console.log("removed DarkMode -_-");
      });
    }
  }
});
