const Step = ({ active, title }) => (
  <div className="flex items-center gap-4">
    <div
      className={`h-6 w-6 rounded-full ${
        active ? "bg-blue-600 animate-pulse" : "bg-gray-600"
      }`}
    />
    <span className="text-sm">{title}</span>
  </div>
);

const EmergencyTimeline = ({ status }) => {
  return (
    <div className="bg-[#1A1D23] p-5 rounded-2xl space-y-4">
      <Step active={true} title="Request Created" />
      <Step
        active={status === "ASSIGNED" || status === "IN_TREATMENT" || status === "CLOSED"}
        title="Ambulance Assigned"
      />
      <Step
        active={status === "IN_TREATMENT" || status === "CLOSED"}
        title="On The Way"
      />
      <Step
        active={status === "CLOSED"}
        title="Completed"
      />
    </div>
  );
};

export default EmergencyTimeline;
