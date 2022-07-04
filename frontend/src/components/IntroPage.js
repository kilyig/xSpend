import React from "react";

import { ReactComponent as ProsperityCycle } from "./prosperity.svg";
import Logo from './xspend_logo.png';


export function IntroPage( { click }) {
  return (
    <div className="container p-4">
      <div className="row">
        <div className="col-12">
          <center>
            <img src={Logo} alt="xSpend logo" width="200"/>
            <p><i>Spend seamlessly, xSpend the economy.</i></p>
          </center>
          <h3>
            <strong><i>About</i></strong>
          </h3>
          <p>
            We are the world's most efficient and frictionless shop. If you want to contribute
            to the economy, we are the fastest way to do so.
          </p>
          <h3>
            <strong><i>Background</i></strong>
          </h3>
          <p>
            Economists have proven that our current economic system -- the one that
            loves words like inflation, economic growth and borrowing costs -- is the 
            way to go (unfortunately there are still <a href="https://yigitkilicoglu.com/files/Discussion_Money_Supply.pdf">some people </a> 
             who question this, but let's forget about them). Fundamental to their 
            argument is a process that we affectionately call the <i>journey to prosperity</i>.
            It tells us why built-in inflation is good, why we should create money on demand, etc.
            Let's recall:
          </p>
          <ProsperityCycle />
          It's simple and intuitive:
          <ol>
            <li>Say you own a wind turbine. The economy is chilling. Prices are chilling, and you have money.</li>
            <li>Oh no, prices are rising. Previously you might have agreed with the tough man who always buys 50 Turkish liras of gasoline,
                but now you realize that you can buy less stuff with the same amount of money.</li>
            <li>You get inspired to grow your business now. After all, these choppers will cost more tomorrow. If you wait, you will lose. It's
                not just you -- everyone feels an urge to buy buy buy. The key idea is that <i>it doesn't matter what you buy</i>.
                Consumption boosts our economy's numbers, so one shouldn't sweat it if the product/service they received
                was useless to them.
            </li>
            <li>More wind turbines mean more electricity produced. Your sales rise, so you become rich. The economy grows, and everyone wins!</li>
          </ol>
          <p>
            If this process smells of a perpetual motion machine, don't worry. To disprove yourself,
            ask a well-versed economics person to show you colorful charts on economic growth. 
          </p>
          <h3>
            <strong><i>xSpend's Innovation</i></strong>
            
          </h3>
          <p>
            Again, <i>it doesn't matter what you buy</i>. To grow the economy, we just
            need to make sure that <i>something</i> is sold. Fashion companies, especially
            Louis Vuitton, have been immensely successful at implementing this principle.
            At xSpend, we believe that we can beat them, even Louis Vuitton. Our products
            are massless, invisible, and fully recyclable. Because our supply
            is virtually infinite, we have the potential to bring GDPs of countries around the
            world to unprecedented levels.
          </p>
          <h3>
            <strong><i>How xSpend works</i></strong>
            
          </h3>
          <ol>
            <li>Get a loan from a bank. Taking out a loan causes new money to be created, thus increasing the money supply and making it easier for the nominal GDP to grow. </li>
            <li>Buy one of our products. This increases consumption and thus the GDP. If you can't find a bank that makes loans in Ether, don't worry.</li>
            <li>Go back home -- we won't give you anything in return. Because you won't have to carry anything, you will remember this shopping experience as very convenient. Your trust in the economy will increase, and so will your willingness to buy in the future. The economy will grow again thanks to all this.</li>
          </ol>
          <h3>
            <strong><i>Our Novel Guiding Principles</i></strong>
          </h3>
          <li> <b>Don't judge a book by its cover:</b> Our products are intentionally invisible to prevent you from buying products that you don't actually need.</li>
          <li> <b>The customer knows the best:</b> Have you ever thought that a product was too cheap? Did you wish that it had a higher price? Well, our Product X lets you set its price. This way, YOU will be the one to decide how much your purchase will contribute to the GDP. Pay whatever your heart and brain tell you. Anything is fair game!</li>
        </div>
      </div>
    </div>
  )
}