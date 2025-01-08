import AppButton from "./AppButton";

const index = () => {
  return (
    <footer className="footer -type-1">
      <div className="container">
        <div className="pt-60 pb-60">
          <div className="row y-gap-40 justify-between xl:justify-start">
            <div className="col-xl-2 col-lg-4 col-sm-6">
              <h5 className="text-16 fw-500 mb-30">Contact Us</h5>
            </div>
            {/* End col */}

            
            {/* End footer menu content */}

            <div className="col-xl-2 col-lg-4 col-sm-6">
              <h5 className="text-16 fw-500 mb-30">Mobile</h5>
              <AppButton />
            </div>
          </div>
        </div>
        {/* End footer top */}

       
        {/* End footer-copyright */}
      </div>
      {/* End container */}
    </footer>
  );
};

export default index;
