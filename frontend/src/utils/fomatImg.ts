  const formatImg = (url: string) => {
    if (url.includes("http")) return url;
    return `${import.meta.env.VITE_SERVER_API}${url}`;
  };

  export default formatImg