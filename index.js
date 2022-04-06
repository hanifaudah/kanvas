const state = {
  canvas: {
    width: 100,
    height: 100,
  },
  color: {
    colors: [
      // row 1
      "rgba(0, 0, 0, 1)",
      "rgba(255, 0, 0, 1)",
      "rgba(0, 255, 0, 1)",
      "rgba(0, 0, 255, 1)",
      "rgba(0, 255, 255, 1)",
      "rgba(255, 255, 0, 1)",
      "rgba(255, 255, 255, 1)",

      // row 2
      "rgba(0, 0, 0, 0.5)",
      "rgba(255, 0, 0, 0.5)",
      "rgba(0, 255, 0, 0.5)",
      "rgba(0, 0, 255, 0.5)",
      "rgba(0, 255, 255, 0.5)",
      "rgba(255, 255, 0, 0.5)",
    ],
    currentColorIdx: 0,
  },
  currentChosenCell: undefined,
};

const renderCanvas = () => {
  const canvas = $("#canvas");
  for (let i = 0; i < state.canvas.height; i++) {
    const $row = $("<tr>", { class: "row" });
    for (let j = 0; j < state.canvas.width; j++) {
      const $cell = $("<td>", {
        class: "cell",
        id: `cell-${j}-${i}`,
        xpos: j,
        ypos: i,
      });
      $row.append($cell);
    }
    canvas.append($row);
  }
};

const enableUIDrag = () => {
  // source: https://htmldom.dev/drag-to-scroll/
  const ele = document.querySelector("body");
  let pos = { top: 0, left: 0, x: 0, y: 0 };

  const mouseDownHandler = function (e) {
    // Change the cursor and prevent user from selecting the text
    ele.style.userSelect = "none";
    pos = {
      // The current scroll
      left: ele.scrollLeft,
      top: ele.scrollTop,
      // Get the current mouse position
      x: e.clientX,
      y: e.clientY,
    };

    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - pos.x;
    const dy = e.clientY - pos.y;
    // Scroll the element
    ele.scrollTop = pos.top - dy;
    ele.scrollLeft = pos.left - dx;
  };

  const mouseUpHandler = function () {
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);

    ele.style.removeProperty("user-select");
  };

  ele.addEventListener("mousedown", mouseDownHandler);
};

const enableScrollZoom = () => {
  // source: https://stackoverflow.com/questions/8189840/get-mouse-wheel-events-in-jquery
  const speed = 1;
  let scale = 1;
  const $canvas = $("#canvas");
  $canvas.bind("mousewheel", function (e) {
    const x = Math.round(
      ((e.pageX - $canvas.offset().left) / ($canvas.width() * scale)) * 100
    );
    const y = Math.round(
      ((e.pageY - $canvas.offset().top) / ($canvas.height() * scale)) * 100
    );
    $canvas.css("transform-origin", `${x}% ${y}%`);

    if (e.originalEvent.wheelDelta / 120 > 0 && scale < 10) {
      // scroll up (zoom in)
      scale += speed;
      $canvas.css("transform", `scale(${scale})`);
    } else if (scale > 1) {
      scale -= speed;
      $canvas.css("transform", `scale(${scale})`);
      // scroll down (zoom out)
    }
    return false;
  });
};

const enableDraw = () => {
  const chooseBlock = () => {
    if (state.currentChosenCell !== undefined)
      state.currentChosenCell.removeClass("chosen");
    state.currentChosenCell = $(
      document.elementFromPoint($(window).width() / 2, $(window).height() / 2)
    );
    state.currentChosenCell.addClass("chosen");
  };
  chooseBlock();
  $("body").scroll(chooseBlock);

  $("#confirm-draw").click(() => {
    state.currentChosenCell.css(
      "background",
      state.color.colors[state.color.currentColorIdx]
    );
  });
};

const renderToolBox = () => {
  const $colorBox = $("#colors");
  state.color.colors.forEach((color, idx) => {
    $colorBlock = $("<div>", {
      class: "color-block",
      id: `color-block-${idx}`,
    });
    $colorBlock.css("background", color);
    $colorBlock.on("click", function (e) {
      $(".color-block").removeClass("chosen");
      state.color.currentColorIdx = idx;
      $(this).addClass("chosen");
    });
    $colorBox.append($colorBlock);
  });
  $(`#color-block-${state.color.currentColorIdx}`).addClass("chosen");
};

$(window).ready(() => {
  renderCanvas();
  enableUIDrag();
  enableScrollZoom();
  enableDraw();
  renderToolBox();
});
