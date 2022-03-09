$(document).ready(function() {
  /**
   * Shows the responsive navigation menu on mobile.
   */
  $("#header > #nav > ul > .icon").click(function() {
    console.log('a')
    $("#header > #nav > ul").toggleClass("responsive");
  });
});
