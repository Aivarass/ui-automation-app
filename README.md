# UI Automation Testing Challenge

This application is designed to test UI automation skills for SDET (Software Development Engineer in Test) candidates. It presents several real-world challenges that automation testers commonly face in production applications.

## Application Overview

This is a React-based Financial Data Dashboard with the following features:

- Three tabs (Table 1, Table 2, and Charts)
- 1000 rows of financial data with company information, stock prices, and market caps
- Virtualized tables that only render visible rows (data appears when scrolled into view and disappears when scrolled out)
- Animated row transitions (rows fade in when appearing and fade out when disappearing)
- Hidden data discrepancies between tabs

## Setup and Running

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone this repository
2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Run the development server:

```bash
npm start
# or
yarn start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in your browser

## Testing Challenges

This application includes several deliberate challenges for automation testers:

1. **Data Virtualization**: 
   - Only visible rows are rendered in the DOM
   - Data disappears when scrolled out of view
   - Rows have animations when appearing and disappearing
   - Automation must handle scrolling while collecting data

2. **Data Discrepancies**:
   - Every 100th row in Table 2 has subtly different data from Table 1
   - Automated tests should detect these inconsistencies

3. **Cross-Tab Data Validation**:
   - Data in charts should correspond to the first 10 rows in the tables
   - Tests should verify data consistency across different visualizations

## Evaluation Criteria

Candidates will be evaluated on their ability to:

1. Create robust, maintainable automation code
2. Handle virtualized content that requires scrolling to access
3. Work with animated elements that appear and disappear
4. Detect subtle data discrepancies
5. Implement proper test assertions and verification
6. Structure tests in a clear, organized manner
7. Document their approach and findings

## Tips for Candidates

- Examine the application structure before writing tests
- Consider using tools that can interact with virtualized content and handle animations
- Implement scrolling strategies to ensure all data is captured
- Use data structures to store and compare information between tabs
- Add logging and screenshots for debugging failures
- Consider potential timing issues with animations during testing

## Technical Details

This project was built with:
- React 18
- Chart.js for data visualization
- CSS animations for row transitions

The main features that present automation challenges are:
- DOM virtualization in `Table` component
- Row animations during scrolling
- Data modifications in `modifyData` function
