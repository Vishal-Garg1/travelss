export default function Image({ src, ...rest }) {
  let imageUrl;

  if (src && (src.startsWith('https://') || src.startsWith('http://'))) {
    imageUrl = src;
  } else {
    imageUrl = 'http://localhost:4000/uploads/' + src;
  }

  return <img {...rest} src={imageUrl} alt={'error'} />;
}
