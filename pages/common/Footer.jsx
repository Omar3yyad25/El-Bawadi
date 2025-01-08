import React from "react";

function Footer() {
  const linksData = [
    { label: "Privacy", url: "#" },
    { label: "Terms", url: "#" },
    { label: "Site Map", url: "#" },
  ];

  return (
    <footer className="footer -dashboard mt-60">
      <div className="footer__row row y-gap-10 items-center justify-between">
        <div className="col-auto">
          <div className="row y-gap-20 items-center">
            <div className="col-auto">
             
            </div>

            <div className="col-auto">
              <div className="row x-gap-20 y-gap-10 items-center text-14">
               
              </div>
            </div>
          </div>
        </div>
        {/* End .col-auto */}

        <div className="col-auto">
          
        </div>
        {/* End .col-auto */}
      </div>
      {/* End .row */}
    </footer>
  );
}

export default Footer;
