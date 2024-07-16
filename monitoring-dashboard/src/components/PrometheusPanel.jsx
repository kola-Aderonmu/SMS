/* eslint-disable react/prop-types */


const PrometheusPanel = ({ prometheusMetrics }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold mb-4">Prometheus Metrics</h2>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
        {prometheusMetrics}
      </pre>
    </div>
  );
};

export default PrometheusPanel;
