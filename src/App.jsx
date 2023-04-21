import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import DataTable from "react-data-table-component";

function App() {
  const [bodegas, setBodegas] = useState([]);
  const [modelos, setModelos] = useState([]);
  const [marcas, setMarcas] = useState([]);
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("0");
  const [modeloSeleccionad0, setModeloSeleccionado] = useState("0");
  const [bodegaSeleccionada, setBodegaSeleccionada] = useState("0");

  useEffect(() => {
    setLoading(true);
    Promise.all([
      axios.get("http://localhost:8000/marcas"),
      axios.get("http://localhost:8000/bodegas")
    ])
      .then(([marcasResponse, bodegasResponse]) => {
        setMarcas(marcasResponse.data);
        setBodegas(bodegasResponse.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const obtenerModelos = async (marca) => {
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:8000/modelos/${marca}`);
      setModelos(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const obtenerDispositivosFilter = async (modelo, marca, bodega) => {
    setLoading(true);
    try {
      console.log(modelo, marca, bodega);
      const { data } = await axios.get(`http://localhost:8000/dispositivos-filter/${modelo}/${marca}/${bodega}`);
      setDispositivos(data);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const handleChange = (e) => {
    if (e.target.name === "bodega") {
      const bodega = e.target.value
      obtenerDispositivosFilter(modeloSeleccionad0, marcaSeleccionada, bodega);
      setBodegaSeleccionada(bodega);
    }
    if (e.target.name === "marca") {
      const marca = e.target.value
      let modeloSeleccionado = modeloSeleccionad0;
      obtenerModelos(marca);
      if (e.target.value === "0") {
        modeloSeleccionado = 0;
        setModeloSeleccionado(0);
      }
      setMarcaSeleccionada(marca);
      obtenerDispositivosFilter(modeloSeleccionado, marca, bodegaSeleccionada);
    }
    if (e.target.name === "modelo") {
      const modelo = e.target.value
      obtenerDispositivosFilter(modelo, marcaSeleccionada, bodegaSeleccionada);
      if (e.target.value === "0") {
        setModeloSeleccionado(0);
      }else{
        setModeloSeleccionado(modelo);
      }
    }
  }

  const columns = [
    {
        name: 'id',
        selector: row => row.id,
    },
    {
        name: 'nombre',
        selector: row => row.nombre,
    },
    {
        name: 'marca',
        selector: row => row.marca,
    },
    {
        name: 'modelo',
        selector: row => row.modelo,
    },
    {
        name: 'bodega',
        selector: row => row.bodega,
    },
];
  

  return (
    <>
      <h1>Prueba técnica Mundo</h1>
      <h2>Matías Rojas Sandoval</h2>
      <div>
        <select name="bodega" id="modega" value={bodegaSeleccionada} onChange={handleChange}>
          <option value="0">
            Bodega
          </option>
          {loading ? (<option>Cargando...</option>) : (bodegas.map(bodega =>
            (<option key={bodega.id} value={bodega.id}>{bodega.nombre}</option>)))}
        </select>
        <select name="marca" id="marca" value={marcaSeleccionada} onChange={handleChange}>
          <option value="0">
            Marca
          </option>
          {loading ? (<option>Cargando...</option>) : (marcas.map(marca =>
            (<option key={marca.id} value={marca.id}>{marca.nombre}</option>)))}
        </select>
        <select name="modelo" id="modelo" value={modeloSeleccionad0} onChange={handleChange}>
          <option value="0">
            Modelo
          </option>
          {loading ? (<option>Cargando...</option>) : (modelos.map(modelo =>
            (<option key={modelo.id} value={modelo.id}>{modelo.nombre}</option>)))}
        </select>
      </div>
      <div>
        <DataTable columns={columns} data={dispositivos} />
      </div>
    </>
  );
}

export default App;
