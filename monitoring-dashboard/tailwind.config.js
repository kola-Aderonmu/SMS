import withMT from  "@material-tailwind/react/utils/withMT";
const config = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {},
  plugins: [],
  important: true,
  corePlugins: {
    preflight: false,
  },
};
export default withMT(config);


 
