var documenterSearchIndex = {"docs":
[{"location":"references/#References","page":"References","title":"References","text":"","category":"section"},{"location":"references/#Clock","page":"References","title":"Clock","text":"","category":"section"},{"location":"references/","page":"References","title":"References","text":"To record changes of array automatically, the array must refer to a time variable, which defined as a clock. There are different types of clock for continuous time ContinuousClock or discrete time DiscreteClock.","category":"page"},{"location":"references/","page":"References","title":"References","text":"RecordedArrays.AbstractClock\nDiscreteClock\nContinuousClock\nnow\nlimit\ninit!\nincrease!","category":"page"},{"location":"references/#RecordedArrays.AbstractClock","page":"References","title":"RecordedArrays.AbstractClock","text":"AbstractClock{T<:Real}\n\nSupertype of clocks with time of type T. Clocks are used to record changes of time. A clock can be iterate by for loop and break when reach to stop.\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.DiscreteClock","page":"References","title":"RecordedArrays.DiscreteClock","text":"DiscreteClock{T, I<:AbstractVector{T}} <: AbstractClock{T}\nDiscreteClock([start], indexset)\nDiscreteClock(stop)\n\nA clock for discrete-time process, it's indexset must be a non-empty AbstractVector.  If the start is not specified, the first item of indexset will be poped and set as start. During iteration, the current time will be updated automatically and returned as iteration item. When the iteration finnished without break, init!(c) wil be applied. DiscreteClock(stop) will create a clock with start=0 and indexset=Base.OneTo(stop)\n\nExamples\n\njulia> c = DiscreteClock(0:3);\n\njulia> now(c)\n0\n\njulia> [(t, now(c)) for t in c]\n3-element Vector{Tuple{Int64, Int64}}:\n (1, 1)\n (2, 2)\n (3, 3)\n\njulia> now(c)\n0\n\njulia> c = DiscreteClock(3); # similar to DiscreteClock(0:3)\n\njulia> (now(c), collect(c))\n(0, [1, 2, 3])\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.ContinuousClock","page":"References","title":"RecordedArrays.ContinuousClock","text":"ContinuousClock{T, I<:Union{Nothing, DiscreteClock}} <: AbstractClock{T}\nContinuousClock(stop, [start=zero(stop)]; [max_epoch=nothing])\n\nA clock for continuous-time process. Unlike the DiscreteClock, during iteration, the current time will not be update automatically, but update by increase! manually. Besides the epoch of current iteration instead of current time will be returned. If the max_epoch is specified, the iteration will break when epoch reach to the max_epoch, even now(c) < limit(c), and break in this way the init!(c) will not be applied.\n\nExamples\n\njulia> c = ContinuousClock(3.0; max_epoch=2);\n\njulia> for epoch in c\n           increase!(c, 1)\n           println(now(c), '\t', epoch)\n       end\n1.0\t1\n2.0\t2\n\njulia> for epoch in c\n           increase!(c, 1)\n           println(now(c), '\t', epoch)\n       end\n3.0\t1\n\njulia> for epoch in c\n           increase!(c, 1)\n           println(now(c), '\t', epoch)\n       end\n1.0\t1\n2.0\t2\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.now","page":"References","title":"RecordedArrays.now","text":"now(c::AbstractClock)\n\nReturn current time of clock c.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.limit","page":"References","title":"RecordedArrays.limit","text":"limit(c::AbstractClock)\n\nReturn the limit of clock c. For a ContinuousClock c, the max time might larger than limit(c).\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.init!","page":"References","title":"RecordedArrays.init!","text":"init!(c::AbstractClock)\n\nUpdate current time to start time.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.increase!","page":"References","title":"RecordedArrays.increase!","text":"increase!(c::ContinuousClock, t::Real)\n\nUpdate current time of clock c to now(c) + t.\n\n\n\n\n\n","category":"function"},{"location":"references/#Recorded-Arrays","page":"References","title":"Recorded Arrays","text":"","category":"section"},{"location":"references/","page":"References","title":"References","text":"Create a recorded array with a clock and a array, then all changes will be recorded automatically. There are two types of recorded array: StaticRArray for array whose values of elements never change but new element will be pushed, DynamicRArray for array whose values of elements will change.","category":"page"},{"location":"references/","page":"References","title":"References","text":"RecordedArrays.AbstractRArray\nstate\nRecordedArrays.StaticRArray\nRecordedArrays.DynamicRArray","category":"page"},{"location":"references/#RecordedArrays.AbstractRArray","page":"References","title":"RecordedArrays.AbstractRArray","text":"AbstractRArray{V,T,N} <: AbstractArray{V,N}\n\nSupertype of recorded N-dimensional arrays with elements of type V and time of type T\", whose changes will be recorded automatically. AbstractRArray is a subtype of AbstractArray, so array operations like getindex, setindex!, length, size, mathematical operations like +, -, *, / and broadcast on a recorded array A works same as its current state state(A).\n\nnote: Note\nAvoid to edit recorded arrays out of loop, because clocks will initial automatically during loop.\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.state","page":"References","title":"RecordedArrays.state","text":"state(A::AbstractRArray{V,T,N}) -> Array{V,N}\n\nGet current state of recorded array A. \n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.StaticRArray","page":"References","title":"RecordedArrays.StaticRArray","text":"StaticRArray{V,T,N} <: AbstractRecord{V,T,N}\n\nRecord type to record changes of arrays whose elements never change but insert or delete can  be created by StaticRArray(t::AbstractClock, xs...) where xs are abstract arrays to be recorded.\n\nImplemented statical arrays:\n\nStaticRVector\n\nnote: Note\nElements of StaticRArray A can be delete by deleteat!(A,i), whose value after deletion is 0.\n\nExamples\n\njulia> c = DiscreteClock(3);\n\njulia> v = StaticRArray(c, [0, 1, 2])\nrecorded 3-element Vector{Int64}:\n 0\n 1\n 2\n\njulia> for epoch in c\n           push!(v, epoch+2) # push a element\n           deleteat!(v, 1)   # delete a element\n       end\n\njulia> v # there are still three element now\nrecorded 3-element Vector{Int64}:\n 3\n 4\n 5\n\njulia> records(v)[6] # but six element are recorded\nRecord Entries\nt: 2-element Vector{Int64}:\n 3\n 3\nv: 2-element Vector{Int64}:\n 5\n 5\n\njulia> gettime(records(v)[1], 2)[1] # element after deletion is 0\n0\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.DynamicRArray","page":"References","title":"RecordedArrays.DynamicRArray","text":"DynamicRArray{V,T,N} <: AbstractRecord{V,T,N}\n\nRecorded array whose elements change overtime can be created by DynamicRArray(t::AbstractClock, xs...) where xs are abstract arrays or numbers (or called scalar) to be recorded.\n\nImplemented dynamic arrays:\n\nDynamicRScalar\nDynamicRVector\n\nnote: Note\nFor a recorded dynamical scalar S, use S[1] = v to change its value instead of S = v.\n\nExamples\n\njulia> c = DiscreteClock(3);\n\njulia> s, v = DynamicRArray(c, 0, [0, 1]);\n\njulia> s # scalar\nrecorded 0\n\njulia> v # vector\nrecorded 2-element Vector{Int64}:\n 0\n 1\n\njulia> for epoch in c\n           s[1] += 1\n           v[1] += 1\n       end\n\njulia> s\nrecorded 3\n\njulia> v\nrecorded 2-element Vector{Int64}:\n 3\n 1\n\njulia> records(s)[1]\nRecord Entries\nt: 4-element Vector{Int64}:\n 0\n 1\n 2\n 3\nv: 4-element Vector{Int64}:\n 0\n 1\n 2\n 3\n\njulia> records(v)[1]\nRecord Entries\nt: 4-element Vector{Int64}:\n 0\n 1\n 2\n 3\nv: 4-element Vector{Int64}:\n 0\n 1\n 2\n 3\n\njulia> records(v)[2]\nRecord Entries\nt: 1-element Vector{Int64}:\n 0\nv: 1-element Vector{Int64}:\n 1\n\n\n\n\n\n","category":"type"},{"location":"references/#View-Records","page":"References","title":"View Records","text":"","category":"section"},{"location":"references/","page":"References","title":"References","text":"You can't access the recorded entries of your recorded array A directly but you can access it by create a Records with r = records(A) and get entries by r[i].","category":"page"},{"location":"references/","page":"References","title":"References","text":"records\nRecordedArrays.Records\nRecordedArrays.AbstractEntries\nRecordedArrays.SingleEntries\nRecordedArrays.UnionEntries\ngettime\nunione\nts\nvs\ntspan","category":"page"},{"location":"references/#RecordedArrays.records","page":"References","title":"RecordedArrays.records","text":"records(A::AbstractRArray)\n\nCreate a Records with RecordedArray A.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.Records","page":"References","title":"RecordedArrays.Records","text":"Records{T<:AbstractRArray}\n\nContain a RecordedArray, whose elements are records of each element of given array.\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.AbstractEntries","page":"References","title":"RecordedArrays.AbstractEntries","text":"AbstractEntries{V,T<:Real}\n\nSupertype of entries, which store changes of specified variable(s) of type V with time of type T.\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.SingleEntries","page":"References","title":"RecordedArrays.SingleEntries","text":"SingleEntries{V,T} <: AbstractEntries{V,T}\n\nType to store changes of a specified variable of type V with time of type T, element of Records.\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.UnionEntries","page":"References","title":"RecordedArrays.UnionEntries","text":"UnionEntries{V,T,N} <: AbstractEntries{T,V}\n\nType store changes of N variables of type V with time of type T, created by unione.\n\n\n\n\n\n","category":"type"},{"location":"references/#RecordedArrays.gettime","page":"References","title":"RecordedArrays.gettime","text":"gettime(e::AbstractEntries{V}, t::Real) -> V\ngettime(e::AbstractEntries{V}, ts) -> Vector{V}\n\nGet the value(s) of e at time t, If t is not in ts(e), return value at time ts(e)[i] where ts(e)[i] < t < ts(e)[i+1]. If a iterator of time ts is given, return the value of each time in ts.\n\nnote: Note\nts must be monotonically increasing.\n\nExamples\n\njulia> c = DiscreteClock(5);\n\njulia> d = DynamicRArray(c, 0);\n\njulia> s = StaticRArray(c, [0]);\n\njulia> for t in c\n           d[1] += 1\n           push!(s, t)\n           t >= 3 && deleteat!(s, 1)\n       end\n\njulia> ed = records(d)[1]\nRecord Entries\nt: 6-element Vector{Int64}:\n 0\n 1\n 2\n 3\n 4\n 5\nv: 6-element Vector{Int64}:\n 0\n 1\n 2\n 3\n 4\n 5\n\njulia> es = records(s)[2]\nRecord Entries\nt: 2-element Vector{Int64}:\n 1\n 4\nv: 2-element Vector{Int64}:\n 1\n 1\n\njulia> gettime(ed, 1.5)\n1\n\njulia> gettime(ed, [5, 6])\n2-element Vector{Int64}:\n 5\n 5\n\njulia> gettime(es, [2, 5])\n2-element Vector{Int64}:\n 1\n 0\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.unione","page":"References","title":"RecordedArrays.unione","text":"unione(es::AbstractEntries...)\nunione(es::Vector{<:AbstractEntries})\nunione(r::Records)\n\nConstruct the union of given entries es. union(r) construct union all of elements of Records r.\n\nExamples\n\njulia> c = DiscreteClock(3);\n\njulia> v = DynamicRArray(c, [1, 1, 1]);\n\njulia> for t in c\n           v[t] = 2\n       end\n\njulia> ea, eb, ec = records(v);\n\njulia> ue = unione(ea, eb)\nRecord Entries\nt: 3-element Vector{Int64}:\n 0\n 1\n 2\nv: 3×2 Matrix{Int64}:\n 1  1\n 2  1\n 2  2\n\njulia> ue = unione(ue, ec)\nRecord Entries\nt: 4-element Vector{Int64}:\n 0\n 1\n 2\n 3\nv: 4×3 Matrix{Int64}:\n 1  1  1\n 2  1  1\n 2  2  1\n 2  2  2\n\njulia> unione(records(v))\nRecord Entries\nt: 4-element Vector{Int64}:\n 0\n 1\n 2\n 3\nv: 4×3 Matrix{Int64}:\n 1  1  1\n 2  1  1\n 2  2  1\n 2  2  2\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.ts","page":"References","title":"RecordedArrays.ts","text":"ts(e::AbstractEntries{V,T}) -> Vector{T}\n\nGet time entries of given e.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.vs","page":"References","title":"RecordedArrays.vs","text":"vs(e::AbstractEntries{V,T}) -> VecOrMat{V}\n\nGet value entries of given e.\n\n\n\n\n\n","category":"function"},{"location":"references/#RecordedArrays.tspan","page":"References","title":"RecordedArrays.tspan","text":"tspan(e::AbstractEntries{V,T}) -> T\n\nGet last time of given e.\n\n\n\n\n\n","category":"function"},{"location":"references/","page":"References","title":"References","text":"toseries","category":"page"},{"location":"references/#RecordedArrays.toseries","page":"References","title":"RecordedArrays.toseries","text":"toseries(e::AbstractEntries)\n\nConvert e to the form accepted by plot of Plots.jl.\n\n\n\n\n\n","category":"function"},{"location":"#Introduction","page":"Introduction","title":"Introduction","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"A Pkg for record changes of array (and scalar) automatically.","category":"page"},{"location":"#Basic-Usage","page":"Introduction","title":"Basic Usage","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"julia> using RecordedArrays\n\njulia> c = ContinuousClock(3.0); # define a clock\n\njulia> v = DynamicRArray(c, [0, 1]) # create a recorded array with the clock\nrecorded 2-element Vector{Int64}:\n 0\n 1\n\njulia> v + v # do math operations as normal array\n2-element Vector{Int64}:\n 0\n 2\n\njulia> increase!(c, 1) # when time goes and array changes, increase the define clock firstly\n1.0\n\njulia> v[1] += 1 # change array's element\n1\n\njulia> push!(v, 1) # push a new element\nrecorded 3-element Vector{Int64}:\n 1\n 1\n 1\n\njulia> r = records(v) # view recorded changes by creating a records\nrecords for 3-element dynamic Vector{Int64} with time Float64\n\njulia> r[1] # show entries of the first element of v\nRecord Entries\nt: 2-element Vector{Float64}:\n 0.0\n 1.0\nv: 2-element Vector{Int64}:\n 0\n 1\n\njulia> Dict(r[1]) # or view it as a dict\nDict{Float64, Int64} with 2 entries:\n  0.0 => 0\n  1.0 => 1\n\njulia> toseries(r[1]) # to the form accepted by plot\n([0.0, 1.0], [0, 1])","category":"page"},{"location":"#Example","page":"Introduction","title":"Example","text":"","category":"section"},{"location":"#Gaussian-random-walk","page":"Introduction","title":"Gaussian random walk","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"This is a simple implementation to simulate a 2-D Gaussian random walk.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"using RecordedArrays\nusing Plots\n\nc = DiscreteClock(10000) # define a clock, the particle will walk 10000 epoch\npos = DynamicRArray(c, [0.0, 0.0]) # create a pos vector of the particle\n\nfor t in c\n    pos .+= randn(2) # walk randomly at each epoch\nend\n\n# plot path of particle\nrandom_walk_plt = plot(vs.(records(pos))...; frame=:none, grid=false, legend=false)","category":"page"},{"location":"#Logistic-growth","page":"Introduction","title":"Logistic growth","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"This is a simple implementation of Gillespie algorithm with direct method to simulate a Logistic growth population with growth rate r=05 and carrying capacity K=100.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"using RecordedArrays\nusing Plots\n\nc = ContinuousClock(100.0) # define a clock, the population will growth for 100 time unit\nn = DynamicRArray(c, 10)   # define a scalar to record population size\n\nconst r = 0.5\nconst K = 100\n\nfor _ in c\n    # eval a_i\n    grow = r * n         # intrinsic growth\n    comp = r * n * n / K # resource competition\n\n    sumed = grow + comp  # sum a_i\n\n    τ = -log(rand()) / sumed # compute time intervel\n\n    increase!(c, τ) # update current time\n\n    # sample a reation and adjust population size\n    if rand() * sumed < grow\n        n[1] += 1\n    else\n        n[1] -= 1\n    end\n\n    state(n) <= 0 && break # break if population extinct\nend\n\nplot(toseries(records(n)[1]); frame=:box, grid=false, legend=false) # plot population dynamics","category":"page"}]
}
