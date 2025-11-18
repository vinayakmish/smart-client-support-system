const Header = ({ title }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
    </div>
  );
};

export default Header;

