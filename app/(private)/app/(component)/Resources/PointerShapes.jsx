function PointerShapes() {
  return (
    <>
      {/* top pointer Arrow */}
      <div className="absolute -top-[18px] -left-[1px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="18"
          viewBox="0 0 12 18"
          fill="none"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M0 17.9733H10.8039C11.0227 17.9726 11.2371 17.9122 11.4241 17.7987C11.6111 17.6853 11.7636 17.5229 11.8653 17.3292C11.9669 17.1355 12.0137 16.9177 12.0008 16.6993C11.9878 16.481 11.9156 16.2703 11.7918 16.0899L0.988585 0.485245C0.764377 0.161256 0.382144 -0.000491609 0 1.12233e-06V17.9733Z"
            fill="#0199DB"
          />
        </svg>
      </div>
      {/* Right pointer Arrow */}
      <div className="absolute -right-[15px] top-1/2 translate-y-[-50%]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="20"
          viewBox="0 0 15 20"
          fill="none"
        >
          <path
            d="M0.000383333 1.00057L0.000382547 19.0006C0.000953789 19.1828 0.0512172 19.3614 0.145761 19.5172C0.240304 19.673 0.375547 19.8001 0.536935 19.8848C0.698322 19.9694 0.879743 20.0085 1.06167 19.9977C1.24359 19.9869 1.41913 19.9267 1.56938 19.8236L14.5694 10.8236C15.1084 10.4506 15.1084 9.55257 14.5694 9.17857L1.56938 0.178573C1.41944 0.074398 1.24381 0.0133073 1.06159 0.00193832C0.879362 -0.00943065 0.697505 0.029357 0.535776 0.114087C0.374047 0.198817 0.238629 0.326249 0.144239 0.482537C0.0498495 0.638826 9.53317e-05 0.817993 0.000383333 1.00057Z"
            fill="#0199DB"
          />
        </svg>
      </div>
    </>
  );
}

export default PointerShapes;
