# NASA Data Integration Guide

## Overview

EcoSpace integrates multiple NASA Earth observation datasets to provide comprehensive air quality monitoring and forecasting. This document outlines the specific NASA APIs and data sources used in the application.

## NASA APIs Used

### 1. NASA Earth Imagery API
**Purpose**: Access satellite imagery for specific locations
**Endpoint**: `https://api.nasa.gov/planetary/earth/imagery`
**Data Source**: Landsat 8
**Use Case**: Visual verification of air quality conditions

```typescript
const earthImageryUrl = `https://api.nasa.gov/planetary/earth/imagery?lon=${lng}&lat=${lat}&date=${date}&dim=0.1&api_key=${nasaApiKey}`
```

### 2. NASA Earth Assets API
**Purpose**: Get available satellite imagery assets
**Endpoint**: `https://api.nasa.gov/planetary/earth/assets`
**Data Source**: Landsat 8
**Use Case**: Check data availability for specific locations

```typescript
const earthAssetsUrl = `https://api.nasa.gov/planetary/earth/assets?lon=${lng}&lat=${lat}&date=${date}&dim=0.1&api_key=${nasaApiKey}`
```

### 3. NASA Open Data Portal
**Purpose**: Access various Earth observation datasets
**Endpoint**: `https://data.nasa.gov/api/views/`
**Data Sources**: MODIS, OMI, VIIRS, Landsat
**Use Case**: Historical air quality data analysis

## Satellite Data Sources

### MODIS (Moderate Resolution Imaging Spectroradiometer)

**Satellites**: Terra, Aqua
**Spectral Bands**: 36 bands from 0.4 to 14.4 μm
**Spatial Resolution**: 250m, 500m, 1km
**Temporal Resolution**: Daily global coverage
**Relevant Products**:
- MOD04: Aerosol Optical Depth
- MOD06: Cloud products
- MOD11: Land Surface Temperature

**Integration Example**:
```typescript
// MODIS Aerosol Optical Depth data
const modisAOD = {
  product: 'MOD04',
  parameter: 'Aerosol_Optical_Depth_Land_Ocean',
  resolution: '10km',
  temporalCoverage: 'daily'
}
```

### OMI (Ozone Monitoring Instrument)

**Satellite**: Aura
**Spectral Range**: 270-500 nm
**Spatial Resolution**: 13km x 24km
**Temporal Resolution**: Daily global coverage
**Relevant Products**:
- OMSO2: Sulfur Dioxide
- OMNO2: Nitrogen Dioxide
- OMO3: Ozone

**Integration Example**:
```typescript
// OMI Nitrogen Dioxide data
const omiNO2 = {
  product: 'OMNO2',
  parameter: 'ColumnAmountNO2',
  resolution: '13km x 24km',
  temporalCoverage: 'daily'
}
```

### VIIRS (Visible Infrared Imaging Radiometer Suite)

**Satellites**: Suomi NPP, NOAA-20
**Spectral Bands**: 22 bands from 0.4 to 12.5 μm
**Spatial Resolution**: 375m, 750m
**Temporal Resolution**: Daily global coverage
**Relevant Products**:
- VNP04: Aerosol Optical Depth
- VNP09: Surface Reflectance
- VNP14: Active Fires

**Integration Example**:
```typescript
// VIIRS Aerosol Optical Depth data
const viirsAOD = {
  product: 'VNP04',
  parameter: 'Aerosol_Optical_Depth_550_Deep_Blue',
  resolution: '6km',
  temporalCoverage: 'daily'
}
```

## Data Processing Pipeline

### 1. Data Acquisition
```typescript
async function fetchNASAData(lat: number, lng: number, date: string) {
  const nasaApiKey = process.env.NASA_API_KEY
  
  // Fetch multiple data sources in parallel
  const [modisData, omiData, viirsData] = await Promise.all([
    fetchMODISData(lat, lng, date),
    fetchOMIData(lat, lng, date),
    fetchVIIRSData(lat, lng, date)
  ])
  
  return {
    modis: modisData,
    omi: omiData,
    viirs: viirsData,
    timestamp: new Date().toISOString()
  }
}
```

### 2. Data Processing
```typescript
function processAirQualityData(nasaData: any) {
  // Convert satellite data to air quality indices
  const aqi = calculateAQI(nasaData.modis.aod, nasaData.omi.no2)
  const pm25 = estimatePM25(nasaData.modis.aod)
  const pm10 = estimatePM10(nasaData.viirs.aod)
  
  return {
    aqi,
    pollutants: {
      pm25,
      pm10,
      o3: nasaData.omi.o3,
      no2: nasaData.omi.no2,
      so2: nasaData.omi.so2
    },
    confidence: calculateConfidence(nasaData),
    dataSource: 'NASA Earth Observation'
  }
}
```

### 3. Quality Assurance
```typescript
function validateNASAData(data: any) {
  const checks = {
    completeness: checkDataCompleteness(data),
    accuracy: checkDataAccuracy(data),
    timeliness: checkDataTimeliness(data),
    consistency: checkDataConsistency(data)
  }
  
  return {
    isValid: Object.values(checks).every(check => check.passed),
    checks,
    qualityScore: calculateQualityScore(checks)
  }
}
```

## Air Quality Index Calculation

### AQI Formula
```typescript
function calculateAQI(aod: number, no2: number, o3: number) {
  // Convert satellite measurements to ground-level concentrations
  const pm25 = aod * 25.4 + 2.1 // Empirical relationship
  const pm10 = aod * 45.2 + 8.3 // Empirical relationship
  
  // Calculate individual AQI values
  const aqiPM25 = calculateIndividualAQI(pm25, 'pm25')
  const aqiPM10 = calculateIndividualAQI(pm10, 'pm10')
  const aqiNO2 = calculateIndividualAQI(no2, 'no2')
  const aqiO3 = calculateIndividualAQI(o3, 'o3')
  
  // Overall AQI is the maximum of individual AQIs
  return Math.max(aqiPM25, aqiPM10, aqiNO2, aqiO3)
}
```

### AQI Breakpoints
```typescript
const aqiBreakpoints = {
  pm25: [
    { low: 0, high: 12.0, aqiLow: 0, aqiHigh: 50 },
    { low: 12.1, high: 35.4, aqiLow: 51, aqiHigh: 100 },
    { low: 35.5, high: 55.4, aqiLow: 101, aqiHigh: 150 },
    { low: 55.5, high: 150.4, aqiLow: 151, aqiHigh: 200 },
    { low: 150.5, high: 250.4, aqiLow: 201, aqiHigh: 300 },
    { low: 250.5, high: 500.4, aqiLow: 301, aqiHigh: 500 }
  ],
  pm10: [
    { low: 0, high: 54, aqiLow: 0, aqiHigh: 50 },
    { low: 55, high: 154, aqiLow: 51, aqiHigh: 100 },
    { low: 155, high: 254, aqiLow: 101, aqiHigh: 150 },
    { low: 255, high: 354, aqiLow: 151, aqiHigh: 200 },
    { low: 355, high: 424, aqiLow: 201, aqiHigh: 300 },
    { low: 425, high: 604, aqiLow: 301, aqiHigh: 500 }
  ]
  // ... other pollutants
}
```

## Machine Learning Integration

### Training Data Sources
```typescript
const trainingDataSources = {
  nasa: {
    modis: 'MODIS Aerosol Optical Depth',
    omi: 'OMI Ozone and Nitrogen Dioxide',
    viirs: 'VIIRS Aerosol and Fire data',
    landsat: 'Landsat Surface Temperature'
  },
  ground: {
    epa: 'EPA Air Quality Monitoring Stations',
    aqicn: 'Air Quality Index China',
    waqi: 'World Air Quality Index'
  },
  weather: {
    noaa: 'NOAA Weather Data',
    gfs: 'Global Forecast System'
  }
}
```

### Feature Engineering
```typescript
function extractFeatures(nasaData: any, weatherData: any) {
  return {
    // Satellite-derived features
    aod: nasaData.modis.aod,
    no2Column: nasaData.omi.no2,
    o3Column: nasaData.omi.o3,
    surfaceTemp: nasaData.landsat.temperature,
    
    // Weather features
    windSpeed: weatherData.windSpeed,
    windDirection: weatherData.windDirection,
    humidity: weatherData.humidity,
    pressure: weatherData.pressure,
    
    // Temporal features
    hourOfDay: new Date().getHours(),
    dayOfWeek: new Date().getDay(),
    month: new Date().getMonth(),
    
    // Spatial features
    latitude: nasaData.location.lat,
    longitude: nasaData.location.lng,
    elevation: nasaData.location.elevation,
    
    // Historical features
    previousAQI: nasaData.historical.aqi,
    trend: nasaData.historical.trend
  }
}
```

## API Rate Limits and Best Practices

### Rate Limits
- **NASA API**: 1000 requests per hour per API key
- **Earth Imagery API**: 1000 requests per hour
- **Earth Assets API**: 1000 requests per hour

### Best Practices
```typescript
// Implement caching to reduce API calls
const cache = new Map()

async function getCachedNASAData(lat: number, lng: number, date: string) {
  const cacheKey = `${lat},${lng},${date}`
  
  if (cache.has(cacheKey)) {
    return cache.get(cacheKey)
  }
  
  const data = await fetchNASAData(lat, lng, date)
  cache.set(cacheKey, data)
  
  // Cache for 1 hour
  setTimeout(() => cache.delete(cacheKey), 60 * 60 * 1000)
  
  return data
}

// Implement retry logic with exponential backoff
async function fetchWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url)
      if (response.ok) return response.json()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000))
    }
  }
}
```

## Data Validation and Quality Control

### Validation Checks
```typescript
function validateNASAData(data: any) {
  const validationResults = {
    completeness: validateCompleteness(data),
    range: validateValueRanges(data),
    consistency: validateConsistency(data),
    timeliness: validateTimeliness(data)
  }
  
  return {
    isValid: Object.values(validationResults).every(result => result.passed),
    results: validationResults,
    qualityScore: calculateQualityScore(validationResults)
  }
}

function validateCompleteness(data: any) {
  const requiredFields = ['modis', 'omi', 'viirs', 'timestamp']
  const missingFields = requiredFields.filter(field => !data[field])
  
  return {
    passed: missingFields.length === 0,
    missingFields,
    completeness: (requiredFields.length - missingFields.length) / requiredFields.length
  }
}
```

## Error Handling

### Common Error Scenarios
```typescript
const errorHandlers = {
  apiKeyInvalid: (error: any) => {
    console.error('NASA API key is invalid or expired')
    return { error: 'API_KEY_INVALID', message: 'Please check your NASA API key' }
  },
  
  rateLimitExceeded: (error: any) => {
    console.error('NASA API rate limit exceeded')
    return { error: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests, please try again later' }
  },
  
  dataUnavailable: (error: any) => {
    console.error('NASA data not available for this location/date')
    return { error: 'DATA_UNAVAILABLE', message: 'No satellite data available for this location' }
  },
  
  networkError: (error: any) => {
    console.error('Network error fetching NASA data')
    return { error: 'NETWORK_ERROR', message: 'Unable to connect to NASA servers' }
  }
}
```

## Future Enhancements

### Planned NASA Data Integrations
- **GPM (Global Precipitation Measurement)**: Precipitation data for air quality correlation
- **SMAP (Soil Moisture Active Passive)**: Soil moisture for dust prediction
- **ICESat-2**: Atmospheric profiling data
- **TROPOMI**: High-resolution atmospheric composition data

### Advanced Processing
- **Machine Learning**: Improved AQI prediction models
- **Real-time Processing**: Stream processing of satellite data
- **Data Fusion**: Combining multiple satellite datasets
- **Uncertainty Quantification**: Confidence intervals for predictions

## Resources

### NASA Documentation
- [NASA API Documentation](https://api.nasa.gov/)
- [Earth Imagery API](https://api.nasa.gov/#earth)
- [Open Data Portal](https://data.nasa.gov/)
- [Earth Science Data Systems](https://earthdata.nasa.gov/)

### Satellite Data Products
- [MODIS Products](https://modis.gsfc.nasa.gov/data/)
- [OMI Products](https://aura.gsfc.nasa.gov/omi.html)
- [VIIRS Products](https://viirsland.gsfc.nasa.gov/)

### Air Quality Standards
- [EPA Air Quality Index](https://www.airnow.gov/aqi/aqi-basics/)
- [WHO Air Quality Guidelines](https://www.who.int/airpollution/guidelines/en/)
- [AQI Calculation Methods](https://www.airnow.gov/sites/default/files/2020-05/aqi-technical-assistance-document-sept2018.pdf)
