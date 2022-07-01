import React from "react";

export function Marketplace({ createProduct, selectedAddress }) {

  function getOptions() {
    const options = {
      path: "product.txt",
      name: 'Product 1',
      description: 'A product from xSpend',
      owner: selectedAddress,
    };
    return options;
  }
  function purchase(price) {
    const options = getOptions();
    createProduct(price, options);
  }

  return (
    <div>
      <h4>Standard products</h4>
      &nbsp;
      <div>
        <button type="button" className="btn btn-primary" onClick={(event) => {purchase("0")}}> Product 1: Free! </button>
      </div>
      &nbsp;
      <div>
        <button type="button" className="btn btn-primary" onClick={(event) => {purchase("0.001")}}> Product 2: 0.001 ETH </button>
      </div>
      &nbsp;
      <div>
        <button type="button" className="btn btn-primary" onClick={(event) => {purchase("0.002")}}> Product 3: 0.002 ETH </button>
      </div>
      &nbsp;
      <div>
        <button type="button" className="btn btn-primary" onClick={(event) => {purchase("0.003")}}> Product 4: 0.003 ETH </button>
      </div>
      &nbsp;
      <div>
        <button type="button" className="btn btn-primary" onClick={(event) => {purchase("0.004")}}> Product 5: 0.004 ETH </button>
      </div>
      &nbsp;
      <div>
        <button type="button" className="btn btn-primary" onClick={(event) => {purchase("0.005")}}> Product 6: 0.005 ETH </button>
      </div>
      &nbsp;
      <div>
        <button type="button" className="btn btn-primary" onClick={(event) => {purchase("0.006")}}> Product 7: 0.006 ETH </button>
      </div>
      &nbsp;
      <div>
        <button type="button" className="btn btn-primary" onClick={(event) => {purchase("0.007")}}> Product 8: 0.007 ETH </button>
      </div>
      &nbsp;
      <div>
        <button type="button" className="btn btn-primary" onClick={(event) => {purchase("0.008")}}> Product 9: 0.008 ETH </button>
      </div>
      &nbsp;
      <div>
        <button type="button" className="btn btn-primary" onClick={(event) => {purchase("0.009")}}> Product 10: 0.009 ETH </button>
      </div>
      &nbsp;
      <h4>Special product -- set your own price!</h4>
      <form
        onSubmit={(event) => {
          // This function just calls the transferTokens callback with the
          // form's data.
          event.preventDefault();

          const formData = new FormData(event.target);
          const amount = formData.get("amount");
          if (isNaN(parseFloat(amount))) {
            alert("Our civilization is not advanced enough to accept non-numeric prices. Please try again in a few years.")
          }
          else
          {
            purchase(amount);
          }
        }}
      >
        <div className="form-group">
          <label>Price</label>
          <input
            className="form-control"
            type="text"
            step="1"
            name="amount"
            placeholder="1000"
            required
          />
        </div>
        {/* <div className="form-group">
          <label>Recipient address</label>
          <input className="form-control" type="text" name="to" required />
        </div> */}
        <div className="form-group">
          <input className="btn btn-primary" type="submit" value="Product X" />
        </div>
      </form>
    </div>
  );
}
