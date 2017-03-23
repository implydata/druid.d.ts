/*
 * Copyright 2015-2015 Metamarkets Group Inc.
 * Copyright 2015-2016 Imply Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/// <reference path="druid.d.ts" />

let timeBoundaryQuery: Druid.Query = {
  "queryType": "timeBoundary",
  "dataSource": "sample_datasource",
  "bound": "maxTime"
};

let timeBoundaryResults: Druid.TimeBoundaryResults = [
  {
    "timestamp": "2013-05-09T18:24:00.000Z",
    "result": {
      "minTime": "2013-05-09T18:24:00.000Z",
      "maxTime": "2013-05-09T18:37:00.000Z"
    }
  }
];


let timeseriesQuery: Druid.Query = {
  "queryType": "timeseries",
  "dataSource": "sample_datasource",
  "granularity": "day",
  "filter": {
    "type": "and",
    "fields": [
      { "type": "selector", "dimension": "sample_dimension1", "value": "sample_value1" },
      {
        "type": "or",
        "fields": [
          { "type": "selector", "dimension": "sample_dimension2", "value": "sample_value2" },
          { "type": "selector", "dimension": "sample_dimension3", "value": "sample_value3" }
        ]
      },
      { "type": "search", "dimension": "sample_dimension1", "query": { "type": "fragment", "values": ["A", "B"] } }
    ]
  },
  "aggregations": [
    { "type": "longSum", "name": "sample_name1", "fieldName": "sample_fieldName1" },
    { "type": "doubleSum", "name": "sample_name2", "fieldName": "sample_fieldName2" },
    {
      "type": "filtered",
      "name": "sample_name3",
      "filter": { "type": "selector", "dimension": "sample_dimension3", "value": "sample_value3" },
      "aggregator": { "type": "doubleSum", "name": "sample_name3", "fieldName": "sample_fieldName3" }
    }
  ],
  "postAggregations": [
    {
      "type": "arithmetic",
      "name": "sample_divide",
      "fn": "/",
      "fields": [
        { "type": "fieldAccess", "name": "sample_name1", "fieldName": "sample_fieldName1" },
        { "type": "fieldAccess", "name": "sample_name2", "fieldName": "sample_fieldName2" }
      ]
    }
  ],
  "intervals": ["2012-01-01T00:00:00.000/2012-01-03T00:00:00.000"]
};

let timeseriesResult: Druid.TimeseriesResults = [
  {
    "timestamp": "2012-01-01T00:00:00.000Z",
    "result": { "sample_name1": 3, "sample_name2": 3, "sample_divide": 3 }
  },
  {
    "timestamp": "2012-01-02T00:00:00.000Z",
    "result": { "sample_name1": 3, "sample_name2": 3, "sample_divide": 3 }
  }
];

let topNQuery: Druid.Query = {
  "queryType": "topN",
  "dataSource": "sample_data",
  "dimension": "sample_dim",
  "threshold": 5,
  "metric": {
    "type": "dimension",
    "ordering": "numeric",
    "previousStop": "a"
  },
  "granularity": "all",
  "filter": {
    "type": "and",
    "fields": [
      {
        "type": "selector",
        "dimension": "dim1",
        "value": "some_value"
      },
      {
        "type": "selector",
        "dimension": "dim2",
        "value": "some_other_val"
      }
    ]
  },
  "aggregations": [
    {
      "type": "longSum",
      "name": "count",
      "fieldName": "count"
    },
    {
      "type": "doubleSum",
      "name": "some_metric",
      "fieldName": "some_metric"
    }
  ],
  "postAggregations": [
    {
      "type": "arithmetic",
      "name": "sample_divide",
      "fn": "/",
      "fields": [
        {
          "type": "fieldAccess",
          "name": "some_metric",
          "fieldName": "some_metric"
        },
        {
          "type": "fieldAccess",
          "name": "count",
          "fieldName": "count"
        }
      ]
    }
  ],
  "intervals": [
    "2013-08-31T00:00:00.000/2013-09-03T00:00:00.000"
  ]
};

let topNResults: Druid.DruidResults = [
  {
    "timestamp": "2013-08-31T00:00:00.000Z",
    "result": [
      {
        "dim1": "dim1_val",
        "count": 111,
        "some_metrics": 10669,
        "average": 96.11711711711712
      },
      {
        "dim1": "another_dim1_val",
        "count": 88,
        "some_metrics": 28344,
        "average": 322.09090909090907
      },
      {
        "dim1": "dim1_val3",
        "count": 70,
        "some_metrics": 871,
        "average": 12.442857142857143
      },
      {
        "dim1": "dim1_val4",
        "count": 62,
        "some_metrics": 815,
        "average": 13.14516129032258
      },
      {
        "dim1": "dim1_val5",
        "count": 60,
        "some_metrics": 2787,
        "average": 46.45
      }
    ]
  }
];

let groupByQuery: Druid.Query = {
  "queryType": "groupBy",
  "dataSource": "sample_datasource",
  "granularity": "day",
  "dimensions": ["dim1", "dim2"],
  "limitSpec": {
    "type": "default",
    "limit": 5000,
    "columns": [
      {
        "dimension": "page",
        "direction": "descending",
        "dimensionOrder": "alphaNumeric"
      },
      "metric1"
    ]
  },
  "filter": {
    "type": "and",
    "fields": [
      { "type": "selector", "dimension": "sample_dimension1", "value": "sample_value1" },
      {
        "type": "or",
        "fields": [
          { "type": "selector", "dimension": "sample_dimension2", "value": "sample_value2" },
          { "type": "selector", "dimension": "sample_dimension3", "value": "sample_value3" }
        ]
      }
    ]
  },
  "aggregations": [
    { "type": "longSum", "name": "sample_name1", "fieldName": "sample_fieldName1" },
    { "type": "doubleSum", "name": "sample_name2", "fieldName": "sample_fieldName2" }
  ],
  "postAggregations": [
    {
      "type": "arithmetic",
      "name": "sample_divide",
      "fn": "/",
      "fields": [
        { "type": "fieldAccess", "name": "sample_name1", "fieldName": "sample_fieldName1" },
        { "type": "fieldAccess", "name": "sample_name2", "fieldName": "sample_fieldName2" }
      ]
    }
  ],
  "intervals": ["2012-01-01T00:00:00.000/2012-01-03T00:00:00.000"],
  "having": {
    type: 'not',
    havingSpec: { "type": "greaterThan", "aggregation": "sample_name1", "value": 0 }
  }
};

let groupByResults: Druid.GroupByResults = [
  {
    "version": "v1",
    "timestamp": "2012-01-01T00:00:00.000Z",
    "event": {
      "dim1": "some_dim_value_one>",
      "dim2": "some_dim_value_two>",
      "sample_name1": "some_sample_name_value_one>",
      "sample_name2": "some_sample_name_value_two>",
      "sample_divide": "some_sample_divide_value"
    }
  },
  {
    "version": "v1",
    "timestamp": "2012-01-01T00:00:00.000Z",
    "event": {
      "dim1": "some_other_dim_value_one>",
      "dim2": "some_other_dim_value_two>",
      "sample_name1": "some_other_sample_name_value_one>",
      "sample_name2": "some_other_sample_name_value_two>",
      "sample_divide": "some_other_sample_divide_value"
    }
  }
];

let segmentMetadataQuery: Druid.Query = {
  "queryType": "segmentMetadata",
  "dataSource": "sample_datasource",
  "intervals": ["2013-01-01/2014-01-01"],
  "toInclude": {
    "type": "list",
    "columns": ['column1', 'column2']
  },
  "merge": true
};

let segmentMetadataResult: Druid.SegmentMetadataResults = [
  {
    "id": "some_id",
    "intervals": ["2013-05-13T00:00:00.000Z/2013-05-14T00:00:00.000Z"],
    "size": 300000,
    "numRows": 654321,
    "columns": {
      "__time": { "type": "LONG", "size": 407240380, "cardinality": null, hasMultipleValues: false },
      "dim1": { "type": "STRING", "size": 100000, "cardinality": 1944, hasMultipleValues: false },
      "dim2": { "type": "STRING", "size": 100000, "cardinality": 1504, hasMultipleValues: true },
      "metric1": { "type": "FLOAT", "size": 100000, "cardinality": null, hasMultipleValues: false }
    },
    aggregators: {
      "metric1": { "type": "doubleSum", "name": "metric1", "fieldName": "metric1" }
    }
  }
];

let selectResults: Druid.SelectResults = [
  {
    "timestamp": "2013-01-01T00:00:00.000Z",
    "result": {
      "pagingIdentifiers": {
        "wikipedia_2012-12-29T00:00:00.000Z_2013-01-10T08:00:00.000Z_2013-01-10T08:13:47.830Z_v9": 4
      },
      "events": [{
        "segmentId": "wikipedia_editstream_2012-12-29T00:00:00.000Z_2013-01-10T08:00:00.000Z_2013-01-10T08:13:47.830Z_v9",
        "offset": 0,
        "event": {
          "timestamp": "2013-01-01T00:00:00.000Z",
          "robot": "1",
          "namespace": "article",
          "anonymous": "0",
          "unpatrolled": "0",
          "page": "11._korpus_(NOVJ)",
          "language": "sl",
          "newpage": "0",
          "user": "EmausBot",
          "count": 1.0,
          "added": 39.0,
          "delta": 39.0,
          "variation": 39.0,
          "deleted": 0.0
        }
      }]
    }
  }
];

let statusResults: Druid.StatusResult = {
  "version": "0.9.0",
  "modules": [
    {
      "name": "io.druid.server.namespace.NamespacedExtractionModule",
      "artifact": "druid-namespace-lookup",
      "version": "0.9.0"
    },
    {
      "name": "io.druid.query.aggregation.datasketches.theta.oldapi.OldApiSketchModule",
      "artifact": "druid-datasketches",
      "version": "0.9.0"
    },
    {
      "name": "io.druid.query.aggregation.datasketches.theta.SketchModule",
      "artifact": "druid-datasketches",
      "version": "0.9.0"
    },
    {
      "name": "io.druid.query.aggregation.histogram.ApproximateHistogramDruidModule",
      "artifact": "druid-histogram",
      "version": "0.9.0"
    }
  ],
  "memory": {
    "maxMemory": 1037959168,
    "totalMemory": 1037959168,
    "freeMemory": 946818992,
    "usedMemory": 91140176
  }
};


let inFilter: Druid.Filter = {
  "type": "in",
  "dimension": "dimTest",
  "values": ["good","bad"]
};

let boundFilter: Druid.Filter = {
  "type": "bound",
  "dimension": "age",
  "lower": "21",
  "lowerStrict": true,
  "upper": "31" ,
  "upperStrict": true,
  "ordering": "numeric"
};

let extractionFnFilter: Druid.Filter = {
  "type": "extraction",
  "dimension": "product",
  "value": "bar_1",
  "extractionFn": {
  "type": "lookup",
    "lookup": {
    "type": "map",
      "map": {
        "product_1": "bar_1",
        "product_5": "bar_1",
        "product_3": "bar_1"
      }
    }
  }
};

let containsFilter: Druid.Filter = {
  "type": "search",
  "dimension": "cityName",
  "query": {
    "type": "contains",
    "value": "San",
    "caseSensitive": true
  }
};

let intervalFilter: Druid.Filter = {
  "type": "interval",
  "dimension": "cityName",
  "intervals": [
      "2014-10-01T00:00:00.000Z/2014-10-07T00:00:00.000Z",
      "2014-11-15T00:00:00.000Z/2014-11-16T00:00:00.000Z"
  ]
};

let having: Druid.Having = {
  "type": "filter",
  "filter": {
    "type": "bound",
    "dimension": "age",
    "lower": "21",
    "lowerStrict": true,
    "upper": "31" ,
    "upperStrict": true,
    "ordering": "numeric"
  }
};

let timeFormatDimensionSpec: Druid.DimensionSpec = {
  "type": "extraction",
  "dimension": "__time",
  "outputName": "dayOfWeek",
  "extractionFn": {
    "type": "timeFormat",
    "format": "EEEE",
    "timeZone": "America/Montreal",
    "locale": "fr"
  }
};

let timeFormatDimensionSpec2: Druid.DimensionSpec = {
  "type": "extraction",
  "dimension": "__time",
  "outputName": "dayOfWeek",
  "extractionFn": {
    "type": "timeFormat",
    "format": "EEEE",
    "timeZone": "America/Montreal",
    "locale": "fr",
    "granularity": {
      "type": "period",
      "period": "P1D",
      "timeZone": "America/Los_Angeles"
    }
  }
};

let regexFilteredDimensionSpec: Druid.DimensionSpec = {
  "type": "regexFiltered",
  "delegate": "tags",
  "pattern": "a+"
};

let mapExtractionFn: Druid.ExtractionFn = {
  "type": "lookup",
  "lookup": {
    "type": "map",
    "map": { "foo": "bar", "baz": "bat" }
  },
  "retainMissingValue": false,
  "injective": false,
  "replaceMissingValueWith": "MISSING"
};

let namespaceExtractionFn: Druid.ExtractionFn = {
  "type": "lookup",
  "lookup": { "type": "namespace", "namespace": "some_lookup" },
  "replaceMissingValueWith": "Unknown",
  "injective": false
};

let substrExtractionFn: Druid.ExtractionFn = {
  "type": "substring",
  "index": 1,
  "length": 4
};

let regexExtractionFn: Druid.ExtractionFn = {
  type: "regex",
  expr: "^(.)",
  "replaceMissingValue" : true,
  "replaceMissingValueWith" : "foobar"
};

let cascadeExtractionFn: Druid.ExtractionFn = {
  "type" : "cascade",
  "extractionFns": [
    {
      "type" : "regex",
      "expr" : "/([^/]+)/",
      "replaceMissingValue": false,
      "replaceMissingValueWith": null
    },
    {
      "type" : "javascript",
      "function" : "function(str) { return \"the \".concat(str) }"
    },
    {
      "type" : "substring",
      "index" : 0, "length" : 7
    }
  ]
};

let stringFormatExtractionFn: Druid.ExtractionFn = {
  "type": "stringFormat",
  "format": "[%s]",
  "nullHandling": "returnNull"
};

let registeredLookupExtractionFn: Druid.ExtractionFn = {
  "type": "registeredLookup",
  "lookup": "some_lookup_name",
  "retainMissingValue": true,
  "injective": false,
  "optimize": true
};

let bucketExtractionFn: Druid.ExtractionFn = {
  "type": "bucket",
  "size": 5,
  "offset": 2
};

let cardinalityAggregation: Druid.Aggregation = {
  "type": "cardinality",
  "name": "distinct_last_name_first_char",
  "fields": [
    {
     "type": "extraction",
     "dimension": "last_name",
     "outputName":  "last_name_first_char",
     "extractionFn": { "type" : "substring", "index" : 0, "length" : 1 }
    }
  ],
  "byRow" : true
};

let thetaAggregation: Druid.Aggregation = {
  "type": "thetaSketch",
  "name": "blah",
  "fieldName": "blah",
  "isInputThetaSketch": false,
  "size": 16384
};

let thetaSketchQuery: Druid.Query = {
  "queryType": "groupBy",
  "dataSource": "test_datasource",
  "granularity": "ALL",
  "dimensions": [],
  "filter": {
    "type": "or",
    "fields": [
      {"type": "selector", "dimension": "product", "value": "A"},
      {"type": "selector", "dimension": "product", "value": "B"}
    ]
  },
  "aggregations": [
    {
      "type" : "filtered",
      "filter" : {
        "type" : "selector",
        "dimension" : "product",
        "value" : "A"
      },
      "aggregator" :     {
        "type": "thetaSketch", "name": "A_unique_users", "fieldName": "user_id_sketch"
      }
    },
    {
      "type" : "filtered",
      "filter" : {
        "type" : "selector",
        "dimension" : "product",
        "value" : "B"
      },
      "aggregator" :     {
        "type": "thetaSketch", "name": "B_unique_users", "fieldName": "user_id_sketch"
      }
    }
  ],
  "postAggregations": [
    {
      "type": "thetaSketchEstimate",
      "name": "final_unique_users",
      "field":
      {
        "type": "thetaSketchSetOp",
        "name": "final_unique_users_sketch",
        "func": "INTERSECT",
        "fields": [
          {
            "type": "fieldAccess",
            "fieldName": "A_unique_users"
          },
          {
            "type": "fieldAccess",
            "fieldName": "B_unique_users"
          }
        ]
      }
    }
  ],
  "intervals": [
    "2014-10-19T00:00:00.000Z/2014-10-22T00:00:00.000Z"
  ]
};
