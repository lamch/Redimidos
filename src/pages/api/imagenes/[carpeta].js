import { getImagenesDeFolder } from '../../../../lib/data';

export default function handler(req, res) {
  const { carpeta } = req.query;
  const imagenes = getImagenesDeFolder(carpeta);
  res.status(200).json(imagenes);
}
