import React from "react";
import PropTypes from "prop-types";

interface IInput {
  id: string;
  name: string;
  label?: string;
  placeholder?: string;
  type?: string;
  onChange: (e: any) => void;
  value?: string;
}

const Input = ({
  id,
  name,
  label,
  placeholder,
  type,
  onChange,
  value,
}: IInput) => {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="text-teal-100 font-['Roobert'] text-md"
        style={{ marginRight: 0 }}
      >
        {label}
      </label>
      <input
        id={id}
        name={name}
        onChange={onChange}
        className="mt-1 font-['Roobert'] bg-neutral-800 border border-gray-200 text-gray-200 text-md rounded-lg focus:ring-teal-500 focus:border-teal-500 block w-full p-2.5"
        placeholder={placeholder}
        type={type}
        style={{ borderWidth: "1px", borderColor: "#2dd4bf" }}
        value={value}
      />
    </div>
  );
};

export default Input;

Input.defaultProps = {
  label: "",
  placeholder: "",
  type: "",
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  onchange: PropTypes.func,
  value: PropTypes.string,
};