import React from 'react';

const LocationSearchPanel = ({
    suggestions = [], // fallback to empty array
    setVehiclePanel,
    setPanelOpen,
    setPickup,
    setDestination,
    activeField
}) => {
    const handleSuggestionClick = (suggestion) => {
        // Use suggestion.description for the input value
        if (activeField === 'pickup') {
            setPickup(suggestion.description);
        } else if (activeField === 'destination') {
            setDestination(suggestion.description);
        }
        // setPanelOpen(false);
        // setVehiclePanel(true);
    };

    return (
        <div className="p-4">
            <h3 className="text-xl font-semibold mb-4">Select a {activeField}</h3>
            {suggestions.length > 0 ? (
                suggestions.map((elem, idx) => (
                    <div
                        key={idx} // Consider using a unique key like elem.place_id if available
                        onClick={() => handleSuggestionClick(elem)}
                        className='flex gap-4 border-2 p-3 border-gray-50 hover:border-black rounded-xl items-center my-2 cursor-pointer transition'
                    >
                        <div className='bg-[#eee] h-8 flex items-center justify-center w-12 rounded-full'>
                            <i className="ri-map-pin-fill"></i>
                        </div>
                        <h4 className='font-medium'>{elem.description}</h4>
                    </div>
                ))
            ) : (
                <div className="text-gray-400 text-center py-4">No suggestions</div>
            )}
        </div>
    );
};

export default LocationSearchPanel;