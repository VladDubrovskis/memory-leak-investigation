<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <title>prerendered o-ads</title>
  <meta name="viewport" content="initial-scale=1.0, width=device-width">
  <link rel="shortcut icon" href="http://im.ft-static.com/m/icons/favicon.ico" type="image/x-icon">
  <link rel="stylesheet" href="https://next-geebee.ft.com/hashed-assets/front-page/main-a94c7ec9.css">
  <link rel="stylesheet" href="css" media="all">
  <script src="js"></script>
  </head>
  <body>
    <header>
      {{{leaderboard}}}
      <h1>{{ip}}</h1>
      <button>Refresh</button>
    </header>
    <section id="main">
      <p>Fondue hard cheese cut the cheese. When the cheese comes out everybody's happy boursin cauliflower cheese cheese strings mozzarella fromage red leicester croque monsieur. Who moved my cheese pecorino macaroni cheese cheeseburger cheesy feet cheese triangles chalk and cheese ricotta. Brie pecorino cheese on toast roquefort ricotta fromage frais dolcelatte pecorino. St. agur blue cheese st. agur blue cheese when the cheese comes out everybody's happy mozzarella danish fontina everyone loves blue castello paneer. Fondue halloumi rubber cheese feta fondue when the cheese comes out everybody's happy danish fontina roquefort. Mascarpone jarlsberg pecorino mascarpone pepper jack cow squirty cheese red leicester. Cheese strings swiss the big cheese.</p>
      <p>The big cheese boursin paneer. Fromage frais pepper jack emmental roquefort emmental parmesan lancashire lancashire. Cheese slices jarlsberg when the cheese comes out everybody's happy halloumi halloumi red leicester stinking bishop gouda. Cut the cheese fromage pecorino croque monsieur stinking bishop cheesy feet chalk and cheese port-salut. Stinking bishop halloumi taleggio stilton cow caerphilly cauliflower cheese feta. Cheeseburger croque monsieur who moved my cheese fromage everyone loves cheese and wine mozzarella cottage cheese. Say cheese cheese strings macaroni cheese swiss gouda edam pepper jack croque monsieur. Cheese and wine smelly cheese cut the cheese fondue rubber cheese blue castello.</p>
      <aside>
        {{{halfpage}}}
      </aside>
      <p>Fromage frais red leicester feta. Monterey jack fromage lancashire macaroni cheese melted cheese everyone loves roquefort lancashire. Cheesy feet cow when the cheese comes out everybody's happy cheese strings ricotta cheese and wine manchego mozzarella. Goat red leicester edam hard cheese cow monterey jack cheese and biscuits danish fontina. Cheesy feet melted cheese parmesan cheese and biscuits brie monterey jack croque monsieur caerphilly. Mozzarella mascarpone cow cheese and wine melted cheese bavarian bergkase when the cheese comes out everybody's happy cheddar. Monterey jack.</p>
      <p>Camembert de normandie fondue st. agur blue cheese. Fondue port-salut halloumi ricotta edam taleggio who moved my cheese paneer. Queso camembert de normandie cauliflower cheese danish fontina ricotta stinking bishop stinking bishop bavarian bergkase. Ricotta pepper jack stinking bishop squirty cheese croque monsieur bocconcini gouda caerphilly. Croque monsieur say cheese blue castello cheese and biscuits parmesan stinking bishop cheese and biscuits cottage cheese. Halloumi goat the big cheese red leicester hard cheese cheddar dolcelatte say cheese. Melted cheese boursin airedale mozzarella cheese on toast danish fontina dolcelatte danish fontina. Swiss manchego monterey jack.</p>
      <p>Red leicester swiss lancashire. Smelly cheese paneer dolcelatte ricotta fromage frais fromage frais paneer goat. Queso roquefort the big cheese cheddar goat cheese slices everyone loves cheese strings. Dolcelatte st. agur blue cheese monterey jack cheese strings who moved my cheese cheesecake the big cheese pecorino. Camembert de normandie edam pecorino cauliflower cheese st. agur blue cheese stilton airedale edam. Manchego fondue edam bocconcini squirty cheese everyone loves chalk and cheese monterey jack. Blue castello gouda goat cheese on toast airedale gouda.</p>
      <p>Cheddar halloumi edam. The big cheese boursin pepper jack cheddar monterey jack port-salut cheese triangles parmesan. Macaroni cheese pecorino cheeseburger emmental blue castello mozzarella fromage frais monterey jack. Gouda st. agur blue cheese halloumi danish fontina cheese strings cauliflower cheese cut the cheese cheese on toast. Rubber cheese port-salut halloumi cheese strings gouda taleggio danish fontina everyone loves. Cheesecake boursin.</p>
    </section>
    <script data-o-ads-config="" type="application/json">
    {{{config}}}
    </script>
    <script>
      oAds.utils.arrayLikeToArray(document.querySelectorAll('[data-o-ads-name] [type="application/json"]')).forEach((item) => {
        name = item.parentNode.parentNode.parentNode.getAttribute('data-o-ads-name')
        console.log(name + ':', JSON.parse(item.innerText));
      });
      document.body.dispatchEvent(new CustomEvent('o.DOMContentLoaded', {bubbles: true, cancelable: false, detail: null}));
      document.querySelector('button').addEventListener('click', function () {
        oAds.slots.forEach(function (slot) {
          slot.fire('refresh', {targeting: {rfrsh: 'true'}});
        });
      });
      document.addEventListener('oAds.refresh', function (event) { event.detail.slot.container.removeAttribute('style');});
    </script>
  </body>
</html>
